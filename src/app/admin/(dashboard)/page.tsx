"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Users,
  IndianRupee,
  ArrowUpRight,
  Loader2,
  Plus,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
  };
  recentOrders: {
    id: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }[];
  topProducts: {
    name: string;
    sold: number;
    revenue: number;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch");
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
          <p className="font-medium mb-2">Could not load dashboard</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">{error}</p>
          <button onClick={fetchStats} className="btn btn-primary">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(data.stats.totalRevenue),
      icon: IndianRupee,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Orders",
      value: data.stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Products",
      value: data.stats.totalProducts.toString(),
      icon: Package,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Customers",
      value: data.stats.totalCustomers.toString(),
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Here's what's happening with your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="btn btn-ghost btn-sm"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl bg-white border border-[var(--color-border)] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Add Product", href: "/admin/products/new", icon: Package },
          { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
          { label: "Edit Homepage", href: "/admin/content", icon: Eye },
          { label: "Manage Coupons", href: "/admin/coupons", icon: ArrowUpRight },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:shadow-sm transition-all group"
          >
            <action.icon className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)]">
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-bold font-heading">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[var(--color-accent)] font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="w-10 h-10 text-[var(--color-warm-300)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">No orders yet</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Orders will appear here once customers start buying
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-[var(--color-surface-muted)] transition-colors block"
                >
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {order.customer} · {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`status-pill status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <span className="text-sm font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-[var(--color-border)]">
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-bold font-heading">Top Products</h2>
          </div>
          {data.topProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-[var(--color-warm-300)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">No sales data yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {data.topProducts.map((product, i) => (
                <div key={product.name} className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-xs font-bold text-[var(--color-text-muted)]">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {product.sold} sold
                      </p>
                    </div>
                    <span className="text-sm font-bold">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
