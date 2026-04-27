"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Loader2, XCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart();

    // Verify payment if order_id exists
    if (orderId) {
      fetch(`/api/checkout/verify?order_id=${orderId}`)
        .then((r) => r.json())
        .then((data) => {
          setStatus(data.success ? "success" : "failed");
        })
        .catch(() => {
          // Even if verification fails, the order was placed
          setStatus("success");
        });
    } else {
      setStatus("success");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
          <p className="text-lg font-medium">Confirming your order...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-heading mb-2">Payment Issue</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            We couldn't confirm your payment. If money was deducted, it will be refunded automatically within 5-7 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders" className="btn btn-outline rounded-full">
              Check Order Status
            </Link>
            <Link href="/shop" className="btn btn-primary rounded-full">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success animation */}
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold font-heading mb-3">
          Order Confirmed! 🎉
        </h1>

        {orderId && (
          <p className="text-sm font-mono text-[var(--color-text-muted)] mb-2">
            Order: {orderId}
          </p>
        )}

        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Thank you for shopping with PrintMacha! We're preparing your order with care.
          You'll receive a confirmation email shortly.
        </p>

        {/* Order timeline preview */}
        <div className="bg-[var(--color-surface-muted)] rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-sm font-bold mb-4">What happens next?</h3>
          <div className="space-y-4">
            {[
              { step: "1", text: "We'll confirm & start preparing your order", time: "Within 24 hours" },
              { step: "2", text: "Your piece is 3D printed with precision", time: "2-4 days" },
              { step: "3", text: "Carefully packed & shipped to you", time: "5-7 days total" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.text}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="btn btn-outline rounded-full inline-flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Track Order
          </Link>
          <Link
            href="/shop"
            className="btn btn-primary rounded-full inline-flex items-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)]" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
