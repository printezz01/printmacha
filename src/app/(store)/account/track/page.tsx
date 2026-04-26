import Link from "next/link";
import { Search, Package, Truck, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track Order" };

export default function TrackOrderPage() {
  return (
    <div className="container-wide py-8 md:py-12">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold font-heading mb-4">Track Your Order</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Enter your order number to see real-time tracking updates.
        </p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input type="text" className="input pl-12 py-4" placeholder="Enter order number (e.g., PM-LX4R-A2BC)" id="track-input" />
          </div>
          <button className="btn btn-primary btn-lg" id="track-btn">Track</button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-3">
          You can find your order number in the confirmation email or your{" "}
          <Link href="/account/orders" className="text-[var(--color-accent)] hover:underline">order history</Link>.
        </p>
      </div>
    </div>
  );
}
