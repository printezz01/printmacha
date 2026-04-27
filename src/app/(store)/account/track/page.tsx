"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const STATUS_META: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  processing: { icon: Package, color: "text-orange-600 bg-orange-50", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderNumber.trim()}`);
      const json = await res.json();

      if (!res.ok || !json.data) {
        setError("Order not found. Please check the order number and try again.");
        return;
      }

      setOrder(json.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentIdx = order ? STATUS_FLOW.indexOf(order.status) : -1;

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading mb-3">Track Your Order</h1>
          <p className="text-[var(--color-text-secondary)]">
            Enter your order number to see real-time tracking updates.
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              className="input pl-12 py-4"
              placeholder="Order number (e.g., PM-MOHLDEQ2-oID9)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              id="track-input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} id="track-btn">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
          </button>
        </form>

        {error && (
          <div className="text-center p-8 rounded-xl border border-red-200 bg-red-50 mb-6">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        {order && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <div>
                <p className="font-mono font-bold">{order.order_number}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    month: "long", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
              <span className={`status-pill status-${order.status}`}>
                {STATUS_META[order.status]?.label || order.status}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <h2 className="font-bold mb-6">Order Progress</h2>
              <div className="flex items-center justify-between">
                {STATUS_FLOW.map((status, i) => {
                  const meta = STATUS_META[status];
                  const Icon = meta.icon;
                  const isActive = currentIdx >= i;
                  const isCurrent = order.status === status;
                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCurrent ? meta.color + " ring-2 ring-offset-2" : isActive ? meta.color : "bg-gray-100 text-gray-400"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`text-xs font-medium ${isActive ? "" : "text-[var(--color-text-muted)]"}`}>
                        {meta.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Tracking info */}
              {order.tracking_number && (
                <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                  <p className="text-sm">
                    <strong>Tracking Number:</strong> {order.tracking_number}
                  </p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] mt-2 hover:underline"
                    >
                      Track on carrier website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <h2 className="font-bold mb-4">Items</h2>
              {(order.order_items || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.product_title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(item.total_price || item.unit_price * item.quantity)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-3 mt-3 border-t border-[var(--color-border)]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-[var(--color-text-muted)] mt-6">
          You can find your order number in the confirmation email or your{" "}
          <Link href="/account/orders" className="text-[var(--color-accent)] hover:underline">order history</Link>.
        </p>
      </div>
    </div>
  );
}
