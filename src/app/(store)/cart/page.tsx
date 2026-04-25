"use client";

import { useState } from "react";

import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Tag, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

export default function CartPage() {
  const { items, subtotal, shipping, total, discount, finalTotal, appliedCoupon, applyCoupon, removeCoupon, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, order_amount: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(data.coupon);
        toast.success(`Coupon "${data.coupon.code}" applied! You save ${formatPrice(data.coupon.discount)}`);
      } else {
        setCouponError(data.error || "Invalid coupon");
        toast.error(data.error || "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
    toast("Coupon removed");
  };

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] mb-8">Shopping Cart</h1>

      {items.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.sale_price || item.product.base_price;
              return (
                <div key={item.product.id} className="flex gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-[var(--color-surface-muted)] shrink-0 overflow-hidden flex items-center justify-center">
                    {item.product.featured_image ? (
                      <img
                        src={item.product.featured_image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-[var(--color-warm-400)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${item.product.slug}`} className="font-semibold text-sm hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                          {item.product.title}
                        </Link>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {item.product.material} · {item.selectedSize || item.product.size}
                        </p>
                      </div>
                      <button
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors p-1"
                        aria-label="Remove item"
                        onClick={() => {
                          removeItem(item.product.id);
                          toast("Item removed from cart");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                        <button
                          className="p-2 hover:bg-[var(--color-surface-muted)] rounded-l-lg"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium">{item.quantity}</span>
                        <button
                          className="p-2 hover:bg-[var(--color-surface-muted)] rounded-r-lg"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-sm">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] space-y-4">
              <h2 className="text-lg font-bold font-[var(--font-heading)]">Order Summary</h2>

              {/* Coupon */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold">{appliedCoupon.code}</span>
                    <span>— {formatPrice(appliedCoupon.discount)} off</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-red-500 transition-colors text-xs underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="input text-sm"
                      id="coupon-input"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <button
                      className="btn btn-outline btn-sm whitespace-nowrap"
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponCode.trim()}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {isApplying ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-[var(--color-error)]">{couponError}</p>}
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-[var(--color-success)]">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Add {formatPrice(999 - subtotal)} more for free shipping
                  </p>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-[var(--color-border)]">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">{formatPrice(finalTotal)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-lg w-full">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="/shop" className="btn btn-ghost btn-sm w-full">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
