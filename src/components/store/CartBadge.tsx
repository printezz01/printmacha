"use client";

import { useCart } from "@/lib/cart-context";

export default function CartBadge() {
  const { itemCount } = useCart();

  return (
    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      {itemCount}
    </span>
  );
}
