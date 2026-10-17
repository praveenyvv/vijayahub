-- ==============================================================================
-- VIJAYAHUB SUPABASE DATABASE SCHEMA (UPGRADED V2)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/fwepxfkxsfgiinyxqwrs/sql)
-- ==============================================================================

-- 1. Create PRODUCTS table (with max_per_customer support)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10,
  max_per_customer INTEGER DEFAULT 0, -- 0 means no limit; >0 sets per-mobile limit (e.g., max 2 units)
  has_variants BOOLEAN DEFAULT false,
  variants JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  badge TEXT,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure column exists if table was already created
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS max_per_customer INTEGER DEFAULT 0;

-- 2. Create ORDERS table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  item_subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  pickup_slot TEXT NOT NULL,
  fulfillment_type TEXT DEFAULT 'pickup',
  status TEXT DEFAULT 'Placed',
  payment_status TEXT DEFAULT 'PAID',
  payment_method TEXT DEFAULT 'UPI QR',
  upi_ref_number TEXT,
  pickup_otp TEXT,
  notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure pickup_otp column exists if table was already created
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pickup_otp TEXT;

-- 3. Create FEEDBACK & SUPPORT table
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  type TEXT DEFAULT 'review', -- 'review', 'complaint', 'suggestion', 'order_help'
  rating INTEGER DEFAULT 5,
  message TEXT NOT NULL,
  order_id TEXT,
  status TEXT DEFAULT 'Open', -- 'Open', 'Resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) & Public Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Allow public update on feedbacks" ON public.feedbacks FOR UPDATE USING (true);

-- 5. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedbacks;

-- 6. Create STORE_SETTINGS table (Store Open/Closed master status)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY,
  is_open BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on store_settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on store_settings" ON public.store_settings FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

-- Seed default store open status
INSERT INTO public.store_settings (id, is_open) VALUES ('store_status', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Create STOCK_NOTIFICATIONS table (Out-of-stock Notify Me requests)
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
CREATE POLICY "Allow public insert on stock_notifications" ON public.stock_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on stock_notifications" ON public.stock_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public update on stock_notifications" ON public.stock_notifications FOR UPDATE USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_notifications;

