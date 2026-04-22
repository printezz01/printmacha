"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/types/database";

// ============================================
// Wishlist Context — Client-side wishlist with localStorage
// ============================================

export interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  featured_image: string | null;
  material: string | null;
  size: string | null;
  stock_quantity: number;
  stock_status: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  category_name?: string;
  category_slug?: string;
}

interface WishlistContextType {
  items: WishlistProduct[];
  itemCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "printmacha_wishlist";

function getStoredWishlist(): WishlistProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeWishlist(items: WishlistProduct[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(getStoredWishlist());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      storeWishlist(items);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      const wishlistProduct: WishlistProduct = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        base_price: product.base_price,
        sale_price: product.sale_price,
        featured_image: product.featured_image,
        material: product.material,
        size: product.size,
        stock_quantity: product.stock_quantity,
        stock_status: product.stock_status,
        is_new_arrival: product.is_new_arrival,
        is_best_seller: product.is_best_seller,
        category_name: product.category?.name,
        category_slug: product.category?.slug,
      };
      return [...prev, wishlistProduct];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      const wishlistProduct: WishlistProduct = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        base_price: product.base_price,
        sale_price: product.sale_price,
        featured_image: product.featured_image,
        material: product.material,
        size: product.size,
        stock_quantity: product.stock_quantity,
        stock_status: product.stock_status,
        is_new_arrival: product.is_new_arrival,
        is_best_seller: product.is_best_seller,
        category_name: product.category?.name,
        category_slug: product.category?.slug,
      };
      return [...prev, wishlistProduct];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
