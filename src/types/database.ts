// ============================================
// PrintMacha - Database Types
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'initiated' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cod_pending' | 'cod_collected';
export type PaymentMethod = 'prepaid' | 'cod';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type CouponType = 'percentage' | 'fixed';
export type HomepageSectionType = 'hero' | 'banner' | 'featured_categories' | 'best_sellers' | 'new_arrivals' | 'testimonials' | 'value_props' | 'collections' | 'promo_strip';
export type UserRole = 'customer' | 'admin';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  tags: string[];
  sku: string;
  base_price: number;
  sale_price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  stock_status: StockStatus;
  featured_image: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_published: boolean;
  material: string | null;
  size: string | null;
  color: string | null;
  finish: string | null;
  delivery_estimate: string | null;
  return_eligible: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: string; // 'size' | 'color' | 'material' | 'finish'
  variant_value: string;
  price_delta: number;
  stock_quantity: number;
  sku_suffix: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Joined
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  payment_method: PaymentMethod;
  coupon_id: string | null;
  shipping_address: Address;
  billing_address: Address | null;
  notes: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_title: string;
  variant_info: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  // Joined
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  cashfree_order_id: string | null;
  cashfree_payment_id: string | null;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway_response: Record<string, unknown> | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  order_id: string;
  user_id: string | null;
  discount_applied: number;
  created_at: string;
}

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown> | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface CustomInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  attachment_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// API / Helper types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: Coupon;
}

export interface CheckoutData {
  shipping_address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  payment_method: PaymentMethod;
  coupon_code?: string;
  guest_email?: string;
  guest_phone?: string;
  notes?: string;
}
