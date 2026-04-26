"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Truck, Shield, CreditCard, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { load } from "@cashfreepayments/cashfree-js";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Chandigarh", "Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, discount, appliedCoupon, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("prepaid");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const codFee = paymentMethod === "cod" ? 49 : 0;
  const finalTotal = total - (appliedCoupon?.discount || 0) + codFee;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            size: i.selectedSize,
          })),
          shipping_address: {
            full_name: formData.get("full_name"),
            phone: formData.get("shipping_phone"),
            address_line_1: formData.get("address_1"),
            address_line_2: formData.get("address_2"),
            city: formData.get("city"),
            state: formData.get("state"),
            pincode: formData.get("pincode"),
            country: "India",
          },
          payment_method: paymentMethod,
          coupon_id: appliedCoupon?.id || null,
          coupon_code: appliedCoupon?.code || null,
          discount: appliedCoupon?.discount || 0,
          guest_email: formData.get("email"),
          guest_phone: formData.get("phone"),
          notes: formData.get("notes"),
          total: finalTotal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === "prepaid" && data.payment_session_id) {
          console.log("Initializing Cashfree with session:", data.payment_session_id.substring(0, 10) + "...", "Mode:", data.environment);
          const cashfree = await load({
            mode: (data.environment as "sandbox" | "production") || "sandbox",
          });
          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
          });
        } else {
          clearCart();
          toast.success(`Order ${data.order_number} placed successfully!`);
          router.push(`/account/orders`);
        }
      } else {
        toast.error(data.error || "Failed to place order. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-[var(--color-text-muted)]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">Add items to your cart before checking out.</p>
        <Link href="/shop" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Checkout</h1>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Lock className="w-4 h-4" />
          <span>Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">

            {/* Guest info */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/login?redirect=/checkout" className="text-[var(--color-accent)] font-semibold hover:underline">
                  Log in
                </Link>{" "}
                for faster checkout with saved addresses.
              </p>
            </div>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-bold font-heading mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email <span className="text-[var(--color-error)]">*</span></label>
                  <input type="email" name="email" className="input" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone <span className="text-[var(--color-error)]">*</span></label>
                  <input type="tel" name="phone" className="input" placeholder="+91 98765 43210" required />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-lg font-bold font-heading mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-[var(--color-error)]">*</span></label>
                    <input type="text" name="full_name" className="input" placeholder="Full name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone <span className="text-[var(--color-error)]">*</span></label>
                    <input type="tel" name="shipping_phone" className="input" placeholder="Phone number" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 1 <span className="text-[var(--color-error)]">*</span></label>
                  <input type="text" name="address_1" className="input" placeholder="House/Flat no., Building, Street" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 2</label>
                  <input type="text" name="address_2" className="input" placeholder="Locality, Landmark (optional)" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City <span className="text-[var(--color-error)]">*</span></label>
                    <input type="text" name="city" className="input" placeholder="City" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">State <span className="text-[var(--color-error)]">*</span></label>
                    <select name="state" className="input" required>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Pincode <span className="text-[var(--color-error)]">*</span></label>
                    <input type="text" name="pincode" className="input" placeholder="560001" maxLength={6} pattern="[0-9]{6}" required />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-lg font-bold font-heading mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "prepaid" ? "border-[var(--color-accent)] bg-[var(--color-brand-orange-50)]" : "border-[var(--color-border)]"}`}>
                  <input type="radio" name="payment" value="prepaid" checked={paymentMethod === "prepaid"} onChange={() => setPaymentMethod("prepaid")} className="accent-[var(--color-accent)]" />
                  <CreditCard className="w-5 h-5 text-[var(--color-accent)]" />
                  <div>
                    <p className="font-medium text-sm">Pay Online</p>
                    <p className="text-xs text-[var(--color-text-muted)]">UPI, Cards, Net Banking, Wallets</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-[var(--color-accent)] bg-[var(--color-brand-orange-50)]" : "border-[var(--color-border)]"}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-[var(--color-accent)]" />
                  <Truck className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  <div>
                    <p className="font-medium text-sm">Cash on Delivery</p>
                    <p className="text-xs text-[var(--color-text-muted)]">₹49 COD fee applies</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Notes */}
            <section>
              <label className="text-sm font-medium mb-1.5 block">Order Notes (optional)</label>
              <textarea name="notes" className="input" rows={3} placeholder="Any special instructions for your order..." />
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <h2 className="text-lg font-bold font-heading mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[var(--color-surface-muted)] shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product.featured_image ? (
                        <img src={item.product.featured_image} alt={item.product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-[var(--color-warm-400)]">×{item.quantity}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.product.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.selectedSize || item.product.size} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium shrink-0">
                      {formatPrice((item.product.sale_price || item.product.base_price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Shipping</span>
                  <span className={shipping === 0 ? "text-[var(--color-success)]" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">COD Fee</span>
                    <span>{formatPrice(codFee)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 mt-4 border-t border-[var(--color-border)]">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary btn-lg mt-6"
                id="place-order-btn"
                disabled={isSubmitting}
              >
                <Lock className="w-4 h-4" />
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
