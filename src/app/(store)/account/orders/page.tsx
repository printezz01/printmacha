import Link from "next/link";
import { Package, ChevronRight, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history and track shipments.",
};

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orders: any[] = [];
  if (user) {
    const { data } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        created_at,
        total,
        status,
        order_items(count)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) {
      orders = data.map(o => ({
        id: o.order_number,
        date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: o.total,
        status: o.status,
        items: o.order_items?.[0]?.count || 0
      }));
    }
  }

  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/account" className="hover:text-[var(--color-text-primary)]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">Orders</span>
      </nav>

      <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{order.date} · {order.items} item(s)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">{formatPrice(order.total)}</p>
                  <span className={`status-pill status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">Start shopping to see your orders here.</p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
