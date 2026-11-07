-- BLUE COMPUTER DATABASE SCHEMA FOR SUPABASE POSTGRESQL

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('owner', 'employee', 'buyer');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'settlement', 'expire', 'cancel', 'deny');

-- 2. Profiles Table (Linked with Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'buyer',
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile automatically when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer'::user_role)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    sku TEXT UNIQUE,
    description TEXT,
    technical_specs JSONB DEFAULT '{}'::jsonb,
    base_price NUMERIC(15, 2) NOT NULL CHECK (base_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    warranty_months INTEGER DEFAULT 12,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL CHECK (total_amount >= 0),
    status order_status NOT NULL DEFAULT 'pending',
    tracking_number TEXT,
    snap_token TEXT,
    snap_redirect_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    unit_price NUMERIC(15, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(15, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payments Table (Records Midtrans Webhooks & Logs)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id TEXT,
    payment_type TEXT,
    gross_amount NUMERIC(15, 2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    raw_payload JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: users can read their own; employees and owners can view all; owners can update all
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.get_current_role() IN ('owner', 'employee'));

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.get_current_role() = 'owner');

-- Categories: public read, owner/employee write
CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admin manage categories" ON public.categories
    FOR ALL USING (public.get_current_role() IN ('owner', 'employee'));

-- Products: public read active products, admin manage all
CREATE POLICY "Public read active products" ON public.products
    FOR SELECT USING (is_active = true OR public.get_current_role() IN ('owner', 'employee'));

CREATE POLICY "Admin manage products" ON public.products
    FOR ALL USING (public.get_current_role() IN ('owner', 'employee'));

-- Orders: buyer read/create their own, admin view/manage all
CREATE POLICY "Buyer read own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.get_current_role() IN ('owner', 'employee'));

CREATE POLICY "Buyer create own order" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin update orders" ON public.orders
    FOR UPDATE USING (public.get_current_role() IN ('owner', 'employee'));

-- Order items: follow parent order access
CREATE POLICY "Read order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.get_current_role() IN ('owner', 'employee'))
        )
    );

CREATE POLICY "Insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Payments: admin view, system insert/update
CREATE POLICY "Admin view payments" ON public.payments
    FOR SELECT USING (public.get_current_role() IN ('owner', 'employee'));

-- 9. Sample Seed Data
INSERT INTO public.categories (name, slug, description, icon_name) VALUES
('Processors (CPU)', 'processors', 'High performance desktop and workstation processors', 'Cpu'),
('Graphics Cards (GPU)', 'graphics-cards', 'Ray-tracing and high FPS gaming & workstation GPUs', 'CircuitBoard'),
('Motherboards', 'motherboards', 'Intel & AMD socket motherboards with modern PCIe and DDR5 support', 'Layers'),
('Memory (RAM)', 'memory', 'High-speed DDR4 & DDR5 gaming memory kits', 'MemoryStick'),
('Storage (SSD & HDD)', 'storage', 'NVMe PCIe 4.0/5.0 M.2 SSDs and high-capacity storage', 'HardDrive'),
('Peripherals & Accessories', 'accessories', 'Mechanical keyboards, lightweight gaming mice, and studio audio', 'Keyboard')
ON CONFLICT (slug) DO NOTHING;
