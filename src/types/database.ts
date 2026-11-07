export type UserRole = 'owner' | 'employee' | 'buyer';

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon_name?: string | null;
  created_at?: string;
}

export interface TechnicalSpecs {
  socket?: string;
  tdp?: string;
  cores_threads?: string;
  memory_type?: string;
  interface?: string;
  form_factor?: string;
  capacity?: string;
  speed?: string;
  vram?: string;
  switch_type?: string;
  connectivity?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  description: string;
  technical_specs: TechnicalSpecs;
  base_price: number;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  warranty_months: number;
  created_at?: string;
  category?: Category;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  product_sku?: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: OrderStatus;
  tracking_number?: string | null;
  snap_token?: string | null;
  snap_redirect_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  transaction_id?: string | null;
  payment_type?: string | null;
  gross_amount: number;
  status: PaymentStatus;
  raw_payload?: Record<string, unknown> | null;
  paid_at?: string | null;
  created_at: string;
}
