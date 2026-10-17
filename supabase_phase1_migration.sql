-- ==============================================================================
-- VIJAYAHUB SUPABASE MIGRATION: PHASE 1 (DATA INTEGRITY, ATOMIC INVENTORY & RLS)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fwepxfkxsfgiinyxqwrs/sql
-- ==============================================================================

-- 1. SCHEMA UPGRADES FOR ORDERS & PRODUCTS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pickup_otp TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS max_per_customer INTEGER DEFAULT 0;

-- Performance indexes for fast customer lookups and status queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders USING btree ((customer->>'phone'));

-- ==============================================================================
-- 2. ATOMIC INVENTORY DEDUCTION & RESTOCK PROCEDURES (ROW-LEVEL LOCKING)
-- Uses SELECT ... FOR UPDATE to prevent race conditions during high-concurrency checkouts.
-- ==============================================================================

-- A. Atomic Decrement for Single Product (TEXT ID)
CREATE OR REPLACE FUNCTION decrement_inventory_atomic(
  p_product_id TEXT,
  p_quantity INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock INT;
  v_product_title TEXT;
BEGIN
  IF p_quantity <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Quantity to deduct must be greater than zero'
    );
  END IF;

  -- Row-level lock: blocks concurrent transactions from reading/writing this row until commit
  SELECT stock, title INTO v_current_stock, v_product_title
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Product not found with ID: ' || p_product_id
    );
  END IF;

  IF v_current_stock < p_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock for "' || v_product_title || '". Requested: ' || p_quantity || ', Available: ' || v_current_stock,
      'available_stock', v_current_stock,
      'product_id', p_product_id
    );
  END IF;

  -- Atomic update
  UPDATE public.products
  SET stock = stock - p_quantity,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_product_id;

  RETURN jsonb_build_object(
    'success', true,
    'product_id', p_product_id,
    'previous_stock', v_current_stock,
    'new_stock', v_current_stock - p_quantity,
    'decremented', p_quantity
  );
END;
$$;

-- B. Overload for UUID Product ID (if applicable)
CREATE OR REPLACE FUNCTION decrement_inventory_atomic(
  p_product_id UUID,
  p_quantity INT
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT decrement_inventory_atomic(p_product_id::TEXT, p_quantity);
$$;

-- C. Atomic Increment (Restock on Order Cancellation or 24-hr Expiry)
CREATE OR REPLACE FUNCTION increment_inventory_atomic(
  p_product_id TEXT,
  p_quantity INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock INT;
BEGIN
  IF p_quantity <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Quantity to restock must be greater than zero'
    );
  END IF;

  -- Row-level lock
  SELECT stock INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Product not found with ID: ' || p_product_id
    );
  END IF;

  -- Atomic update
  UPDATE public.products
  SET stock = stock + p_quantity,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_product_id;

  RETURN jsonb_build_object(
    'success', true,
    'product_id', p_product_id,
    'previous_stock', v_current_stock,
    'new_stock', v_current_stock + p_quantity,
    'restocked', p_quantity
  );
END;
$$;

-- D. Overload for UUID Product ID (Restock)
CREATE OR REPLACE FUNCTION increment_inventory_atomic(
  p_product_id UUID,
  p_quantity INT
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT increment_inventory_atomic(p_product_id::TEXT, p_quantity);
$$;

-- E. Batch Multi-Item Atomic Checkout Reservation
-- Validates all items in the cart before deducting any. If one item is out of stock,
-- the entire batch is rolled back, preventing partial reservations.
CREATE OR REPLACE FUNCTION decrement_order_inventory_atomic(p_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_prod_id TEXT;
  v_qty INT;
  v_current_stock INT;
  v_title TEXT;
BEGIN
  -- Pass 1: Verify all items have sufficient stock under FOR UPDATE row locks
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->>'id';
    v_qty := COALESCE((v_item->>'quantity')::INT, 1);

    SELECT stock, title INTO v_current_stock, v_title
    FROM public.products
    WHERE id = v_prod_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Product not found in catalog: ' || v_prod_id
      );
    END IF;

    IF v_current_stock < v_qty THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Insufficient stock for "' || v_title || '". Requested: ' || v_qty || ', Available: ' || v_current_stock,
        'failed_product_id', v_prod_id,
        'available_stock', v_current_stock
      );
    END IF;
  END LOOP;

  -- Pass 2: Deduct stock atomically across all items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->>'id';
    v_qty := COALESCE((v_item->>'quantity')::INT, 1);

    UPDATE public.products
    SET stock = stock - v_qty,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_prod_id;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'All cart items reserved and deducted atomically'
  );
END;
$$;

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES FOR ORDERS
-- Ensures customers only view/edit their own orders, while counter staff/admin retain full access.
-- ==============================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Clean up existing legacy permissive policies
DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_update_policy" ON public.orders;

-- A. INSERT POLICY:
-- Authenticated users insert their own order with matching user_id; guest checkouts permitted
CREATE POLICY "orders_insert_policy" ON public.orders
FOR INSERT
WITH CHECK (
  auth.uid() IS NULL 
  OR user_id IS NULL 
  OR user_id = auth.uid()
);

-- B. SELECT POLICY:
-- 1. Owner by auth.uid()
-- 2. Owner by authenticated phone number in JWT
-- 3. Store Counter Admin / Staff role (service_role or user_metadata.role = 'admin')
-- 4. Guest order fallback (user_id IS NULL)
CREATE POLICY "orders_select_policy" ON public.orders
FOR SELECT
USING (
  -- Customer owns this order by Supabase Auth UID
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  -- Or customer's verified phone number matches order phone
  OR (auth.jwt() ->> 'phone' IS NOT NULL AND (customer->>'phone') LIKE '%' || RIGHT(auth.jwt() ->> 'phone', 10))
  -- Or store admin / service role
  OR (auth.jwt() ->> 'role' = 'service_role')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  -- Guest orders visible prior to auth migration
  OR (user_id IS NULL)
);

-- C. UPDATE POLICY:
-- Staff can update order status; customer can cancel their own Placed order
CREATE POLICY "orders_update_policy" ON public.orders
FOR UPDATE
USING (
  -- Store Admin / Staff can update any order status (Packed, Ready, Completed)
  (auth.jwt() ->> 'role' = 'service_role')
  OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  OR ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  -- Customer can only cancel their own order while it is still 'Placed'
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid() AND status = 'Placed')
  -- Guest fallback
  OR (user_id IS NULL)
);

-- ==============================================================================
-- 4. GRANT EXECUTE PERMISSIONS
-- ==============================================================================
GRANT EXECUTE ON FUNCTION decrement_inventory_atomic(TEXT, INT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION decrement_inventory_atomic(UUID, INT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_inventory_atomic(TEXT, INT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_inventory_atomic(UUID, INT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION decrement_order_inventory_atomic(JSONB) TO anon, authenticated, service_role;

-- ==============================================================================
-- 5. STORE SETTINGS TABLE (MASTER STORE STATUS TOGGLE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY,
  is_open BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "store_settings_select_policy" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "store_settings_upsert_policy" ON public.store_settings FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

INSERT INTO public.store_settings (id, is_open) VALUES ('store_status', true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. STOCK NOTIFICATIONS TABLE (OUT-OF-STOCK "NOTIFY ME" FLOW)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.stock_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  contact TEXT NOT NULL,
  customer_name TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_notifications_insert_policy" ON public.stock_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_notifications_select_policy" ON public.stock_notifications FOR SELECT USING (true);
CREATE POLICY "stock_notifications_update_policy" ON public.stock_notifications FOR UPDATE USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_notifications;

