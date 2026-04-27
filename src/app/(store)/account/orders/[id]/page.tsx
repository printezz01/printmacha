import Link from "next/link";
import { ChevronRight, Package, Truck, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import OrderActions from "./OrderActions";

export const metadata: Metadata = {
  title: "Order Details",
};

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_META: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Order Placed" },
  confirmed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  processing: { icon: Package, color: "text-orange-600 bg-orange-50", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", id)
    .eq("user_id", user.id)
    .single();

  if (!order) return notFound();

  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  // Check return eligibility (7 days from delivery)
  let returnEligible = false;
  if (order.status === "delivered") {
    const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : new Date(order.updated_at);
    const daysSince = Math.floor((Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24));
    returnEligible = daysSince <= 7;
  }

  // Can cancel if not yet shipped
  const canCancel = ["pending", "confirmed", "processing"].includes(order.status);

  const address = order.shipping_address || {};

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6 flex-wrap">
        <Link href="/account" className="hover:text-[var(--color-text-primary)]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/account/orders" className="hover:text-[var(--color-text-primary)]">Orders</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">{order.order_number}</span>
      </nav>

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">Order {order.order_number}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Placed on {date}</p>
        </div>
        <span className={`status-pill status-${order.status} text-sm`}>
          {STATUS_META[order.status]?.label || order.status}
        </span>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="mb-8 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <h2 className="font-semibold mb-5">Order Progress</h2>
          <div className="flex items-center">
            {STATUS_FLOW.map((status, i) => {
              const meta = STATUS_META[status];
              const Icon = meta.icon;
              const isActive = currentIdx >= i;
              const isCurrent = order.status === status;
              return (
                <div key={status} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCurrent ? meta.color + " ring-2 ring-offset-2" : isActive ? meta.color : "bg-gray-100 text-gray-400"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "" : "text-[var(--color-text-muted)]"}`}>
                      {meta.label}
                    </span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-5 ${isActive && i < currentIdx ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tracking Info */}
          {order.tracking_number && (
            <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1">
                <p className="text-sm">
                  <strong>Tracking:</strong> {order.tracking_number}
                  {order.courier_name && <span className="text-[var(--color-text-muted)]"> via {order.courier_name}</span>}
                </p>
                {order.estimated_delivery && (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Estimated delivery: {new Date(order.estimated_delivery).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </p>
                )}
              </div>
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm inline-flex items-center gap-1"
                >
                  Track Shipment <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="mb-8 p-6 rounded-xl border border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h2 className="font-bold text-red-700">Order Cancelled</h2>
              <p className="text-sm text-red-600">
                {order.cancelled_at
                  ? `Cancelled on ${new Date(order.cancelled_at).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}`
                  : "This order has been cancelled"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-[var(--color-border)]">
                {item.product_image ? (
                  <img src={item.product_image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[var(--color-surface-muted)] shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {item.selected_size ? `Size: ${item.selected_size} · ` : ""}
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-sm">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>

          {/* Cancel/Return Actions */}
          <OrderActions
            orderNumber={order.order_number}
            canCancel={canCancel}
            returnEligible={returnEligible}
            status={order.status}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div>
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="p-5 rounded-xl border border-[var(--color-border)] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>−{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Shipping</span>
                <span className={order.shipping_amount == 0 ? "text-green-600" : ""}>
                  {order.shipping_amount == 0 ? "Free" : formatPrice(order.shipping_amount)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-[var(--color-border)]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] pt-2">
                Payment: {order.payment_method === "prepaid" ? "Paid Online" : "Cash on Delivery"}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <div className="p-5 rounded-xl border border-[var(--color-border)] text-sm">
              <p className="font-medium">{address.full_name}</p>
              {address.address_line_1 && <p className="text-[var(--color-text-secondary)]">{address.address_line_1}</p>}
              {address.address_line_2 && <p className="text-[var(--color-text-secondary)]">{address.address_line_2}</p>}
              <p className="text-[var(--color-text-secondary)]">
                {[address.city, address.state, address.postal_code || address.pincode].filter(Boolean).join(", ")}
              </p>
              {address.phone && <p className="text-[var(--color-text-muted)] mt-2">📞 {address.phone}</p>}
            </div>
          </div>

          {/* Need Help */}
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
            <h3 className="font-semibold text-sm mb-2">Need Help?</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              Contact us for any issues with your order
            </p>
            <Link href="/contact" className="btn btn-outline btn-sm w-full text-center">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
