"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/types/database";

// ============================================
// Cart Context — Client-side cart with localStorage
// ============================================

export interface CartProduct {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  featured_image: string | null;
  material: string | null;
  size: string | null;
  stock_quantity: number;
  category_name?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  selectedSize?: string;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  type: string;
  value: number;
  discount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  discount: number;
  finalTotal: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "printmacha_cart";
const COUPON_STORAGE_KEY = "printmacha_coupon";
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getStoredCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(COUPON_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage might be full or unavailable
  }
}

function storeCoupon(coupon: AppliedCoupon | null) {
  if (typeof window === "undefined") return;
  try {
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(getStoredCart());
    setAppliedCoupon(getStoredCoupon());
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage on change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      storeCart(items);
    }
  }, [items, isHydrated]);

  // Persist coupon to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      storeCoupon(appliedCoupon);
    }
  }, [appliedCoupon, isHydrated]);

  const addItem = useCallback((product: Product, quantity = 1, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock_quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      const cartProduct: CartProduct = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        base_price: product.base_price,
        sale_price: product.sale_price,
        featured_image: product.featured_image,
        material: product.material,
        size: product.size,
        stock_quantity: product.stock_quantity,
        category_name: product.category?.name,
      };
      return [...prev, { product: cartProduct, quantity: Math.min(quantity, product.stock_quantity), selectedSize: size }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock_quantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  const applyCoupon = useCallback((coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.base_price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, total - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        total,
        discount,
        finalTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
