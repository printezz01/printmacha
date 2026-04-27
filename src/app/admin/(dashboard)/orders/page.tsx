"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Loader2,
  Package,
  RefreshCw,
  Filter,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function statusLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      setOrders(json.data || []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = !statusFilter || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.order_number?.toLowerCase().includes(q) ||
        o.guest_email?.toLowerCase().includes(q) ||
        o.shipping_address?.full_name?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Orders</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={fetchOrders} className="btn btn-ghost btn-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status pills summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !statusFilter
              ? "bg-[var(--color-text-primary)] text-white border-transparent"
              : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)]"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.filter((s) => s.value && statusCounts[s.value]).map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value === statusFilter ? "" : s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              statusFilter === s.value
                ? "bg-[var(--color-text-primary)] text-white border-transparent"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)]"
            }`}
          >
            {s.label} ({statusCounts[s.value] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          className="input pl-10"
          placeholder="Search by order #, name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table/Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-16 text-center">
          <Package className="w-12 h-12 text-[var(--color-warm-300)] mx-auto mb-4" />
          <p className="font-medium mb-1">No orders found</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {orders.length === 0
              ? "Orders will appear here once customers start buying"
              : "Try a different search or filter"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Order</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Customer</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Date</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Items</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Total</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Payment</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Status</th>
                  <th className="text-left p-4 font-medium text-[var(--color-text-muted)]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-muted)] transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-medium text-xs">{order.order_number}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{order.shipping_address?.full_name || "Guest"}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{order.guest_email}</p>
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">{formatDate(order.created_at)}</td>
                    <td className="p-4 text-[var(--color-text-muted)]">{order.order_items?.length || 0}</td>
                    <td className="p-4 font-bold">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.payment_method === 'prepaid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {order.payment_method === 'prepaid' ? 'Prepaid' : 'COD'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`status-pill status-${order.status}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/orders/${order.order_number || order.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[var(--color-border)]">
            {filtered.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.order_number || order.id}`}
                className="flex items-center justify-between p-4 hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <div>
                  <p className="font-mono font-medium text-sm">{order.order_number}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {order.shipping_address?.full_name || order.guest_email} · {formatDate(order.created_at)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`status-pill status-${order.status}`}>
                      {statusLabel(order.status)}
                    </span>
                    <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
