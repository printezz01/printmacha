import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders | Admin" };

export default function AdminOrdersPage() {
  const orders = [
    { id: "PM-LX4R-A2BC", customer: "Ananya S.", email: "ananya@example.com", total: 1547, status: "shipped", payment: "paid", method: "prepaid", date: "Apr 15, 2026", items: 2 },
    { id: "PM-KW3Q-Y1ZA", customer: "Rahul M.", email: "rahul@example.com", total: 2899, status: "confirmed", payment: "paid", method: "prepaid", date: "Apr 14, 2026", items: 1 },
    { id: "PM-JH2P-X0WZ", customer: "Priya K.", email: "priya@example.com", total: 699, status: "processing", payment: "cod_pending", method: "cod", date: "Apr 14, 2026", items: 1 },
    { id: "PM-GF1N-W9VY", customer: "Vikram J.", email: "vikram@example.com", total: 3498, status: "pending", payment: "pending", method: "prepaid", date: "Apr 13, 2026", items: 2 },
    { id: "PM-ED0M-V8UX", customer: "Sneha R.", email: "sneha@example.com", total: 549, status: "delivered", payment: "paid", method: "prepaid", date: "Apr 12, 2026", items: 1 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Orders</h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input type="text" className="input pl-10" placeholder="Search orders..." />
        </div>
        <select className="input w-auto">
          <option>All Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Order</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Customer</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Date</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Total</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Payment</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Status</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--color-surface-muted)] transition-colors">
                  <td className="p-4 font-medium">{order.id}</td>
                  <td className="p-4">
                    <p>{order.customer}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{order.email}</p>
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">{order.date}</td>
                  <td className="p-4 font-bold">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className={`status-pill status-${order.payment}`}>
                      {order.payment === "cod_pending" ? "COD" : order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`status-pill status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="btn btn-ghost btn-sm btn-icon">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
