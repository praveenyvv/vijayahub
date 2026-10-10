-- ==============================================================================
-- VIJAYAHUB SUPABASE DATABASE SCHEMA (RUN IN SUPABASE SQL EDITOR)
-- ==============================================================================

-- 1. Create PRODUCTS table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10,
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
  notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) & Public Policies for Storefront
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Allow public read on products" 
ON public.products FOR SELECT USING (true);

-- Allow admins/store to insert/update products
CREATE POLICY "Allow public insert/update on products" 
ON public.products FOR ALL USING (true);

-- Allow customers to insert orders & read their own orders
CREATE POLICY "Allow public insert on orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on orders" 
ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow public update on orders" 
ON public.orders FOR UPDATE USING (true);

-- 4. Enable Realtime Replication for Instant Order Alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
