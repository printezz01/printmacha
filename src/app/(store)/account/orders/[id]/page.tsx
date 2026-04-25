import Link from "next/link";
import { ChevronRight, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("order_number", id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return notFound();
  }

  const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6 flex-wrap">
        <Link href="/account" className="hover:text-[var(--color-text-primary)]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/account/orders" className="hover:text-[var(--color-text-primary)]">Orders</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">{order.order_number}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Order {order.order_number}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Placed on {date}</p>
        </div>
        <span className={`status-pill status-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
      </div>

      {/* Order Timeline */}
      <div className="mb-8 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <h2 className="font-semibold mb-4">Order Status</h2>
        <div className="flex items-center gap-0">
          {[
            { label: "Confirmed", icon: CheckCircle, done: true },
            { label: "Processing", icon: Package, done: true },
            { label: "Shipped", icon: Truck, done: true },
            { label: "Delivered", icon: CheckCircle, done: false },
          ].map((step, i) => (
            <div key={step.label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  (order.status === 'delivered' || (order.status === 'shipped' && i < 3) || (order.status === 'processing' && i < 2) || (order.status === 'confirmed' && i < 1) || (order.status === 'pending' && i < 1) || step.done) ? "bg-[var(--color-success)] text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{step.label}</span>
              </div>
              {i < 3 && (
                <div className={`h-0.5 flex-1 -mt-5 ${step.done ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <p className="text-sm"><strong>Tracking:</strong> {order.tracking_number || "Not available yet"}</p>
          {order.tracking_url && <a href={order.tracking_url} className="text-sm text-[var(--color-accent)] hover:underline">Track on carrier website →</a>}
        </div>
      </div>

      {/* Order Items */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-[var(--color-border)]">
                <div className="w-16 h-16 rounded-lg bg-[var(--color-surface-muted)] shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{item.variant_info ? `Variant: ${item.variant_info} · ` : ""}Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-sm">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Summary</h2>
          <div className="p-5 rounded-xl border border-[var(--color-border)] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Shipping</span>
              <span className={order.shipping_amount === 0 ? "text-[var(--color-success)]" : ""}>{order.shipping_amount === 0 ? "Free" : formatPrice(order.shipping_amount)}</span>
            </div>
            <div className="flex justify-between font-bold pt-3 border-t border-[var(--color-border)]">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="pt-3 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)]">Payment: {order.payment_method.toUpperCase()}</p>
            </div>
          </div>

          <h2 className="font-semibold mt-6 mb-4">Shipping Address</h2>
          <div className="p-5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
            <p className="font-medium text-[var(--color-text-primary)]">{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.address_line_1}</p>
            {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
            <p>{order.shipping_address.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
