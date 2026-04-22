// ============================================
// Google Analytics 4 - Tracking Utility
// ============================================

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// Check if gtag is available
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Core event tracking
export const trackEvent = (event: GTagEvent) => {
  if (!isGtagAvailable()) return;
  const { action, ...params } = event;
  window.gtag('event', action, params);
};

// ---- Ecommerce Events ----

export const trackPageView = (url: string) => {
  if (!isGtagAvailable()) return;
  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
    page_path: url,
  });
};

export const trackViewItemList = (items: EcommerceItem[], listName: string) => {
  trackEvent({
    action: 'view_item_list',
    item_list_name: listName,
    items,
  });
};

export const trackSelectItem = (item: EcommerceItem, listName: string) => {
  trackEvent({
    action: 'select_item',
    item_list_name: listName,
    items: [item],
  });
};

export const trackViewItem = (item: EcommerceItem) => {
  trackEvent({
    action: 'view_item',
    currency: 'INR',
    value: item.price,
    items: [item],
  });
};

export const trackAddToCart = (item: EcommerceItem) => {
  trackEvent({
    action: 'add_to_cart',
    currency: 'INR',
    value: item.price * (item.quantity || 1),
    items: [item],
  });
};

export const trackRemoveFromCart = (item: EcommerceItem) => {
  trackEvent({
    action: 'remove_from_cart',
    currency: 'INR',
    value: item.price * (item.quantity || 1),
    items: [item],
  });
};

export const trackViewCart = (items: EcommerceItem[], value: number) => {
  trackEvent({
    action: 'view_cart',
    currency: 'INR',
    value,
    items,
  });
};

export const trackBeginCheckout = (items: EcommerceItem[], value: number, coupon?: string) => {
  trackEvent({
    action: 'begin_checkout',
    currency: 'INR',
    value,
    coupon,
    items,
  });
};

export const trackAddShippingInfo = (items: EcommerceItem[], value: number, shippingTier: string) => {
  trackEvent({
    action: 'add_shipping_info',
    currency: 'INR',
    value,
    shipping_tier: shippingTier,
    items,
  });
};

export const trackAddPaymentInfo = (items: EcommerceItem[], value: number, paymentType: string) => {
  trackEvent({
    action: 'add_payment_info',
    currency: 'INR',
    value,
    payment_type: paymentType,
    items,
  });
};

export const trackPurchase = (
  transactionId: string,
  items: EcommerceItem[],
  value: number,
  shipping: number,
  coupon?: string
) => {
  trackEvent({
    action: 'purchase',
    transaction_id: transactionId,
    currency: 'INR',
    value,
    shipping,
    coupon,
    items,
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent({
    action: 'search',
    search_term: searchTerm,
  });
};

export const trackSignUp = (method: string) => {
  trackEvent({
    action: 'sign_up',
    method,
  });
};

export const trackLogin = (method: string) => {
  trackEvent({
    action: 'login',
    method,
  });
};

export const trackGenerateLead = (source: string) => {
  trackEvent({
    action: 'generate_lead',
    source,
  });
};

// ---- Types ----

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
  discount?: number;
}

// Convert product to GA4 ecommerce item
export const productToItem = (product: {
  id: string;
  title: string;
  category?: { name: string } | null;
  sale_price?: number | null;
  base_price: number;
}, quantity = 1): EcommerceItem => ({
  item_id: product.id,
  item_name: product.title,
  item_category: product.category?.name,
  price: product.sale_price || product.base_price,
  quantity,
  discount: product.sale_price ? product.base_price - product.sale_price : undefined,
});

// Global type augmentation for gtag
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}
