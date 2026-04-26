import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard | PrintMacha" };

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Revenue", value: formatPrice(247500), change: "+12.5%", up: true, icon: DollarSign },
    { label: "Orders", value: "156", change: "+8.2%", up: true, icon: ShoppingCart },
    { label: "Products", value: "14", change: "+2", up: true, icon: Package },
    { label: "Customers", value: "89", change: "+15.3%", up: true, icon: Users },
  ];

  const recentOrders = [
    { id: "PM-LX4R-A2BC", customer: "Ananya S.", total: 1547, status: "shipped", date: "Apr 15" },
    { id: "PM-KW3Q-Y1ZA", customer: "Rahul M.", total: 2899, status: "confirmed", date: "Apr 14" },
    { id: "PM-JH2P-X0WZ", customer: "Priya K.", total: 699, status: "processing", date: "Apr 14" },
    { id: "PM-GF1N-W9VY", customer: "Vikram J.", total: 3498, status: "pending", date: "Apr 13" },
    { id: "PM-ED0M-V8UX", customer: "Sneha R.", total: 549, status: "delivered", date: "Apr 12" },
  ];

  const topProducts = [
    { name: "Geodesic Pen Holder", sold: 28, revenue: 15372 },
    { name: "Wave Form Texture Panel", sold: 18, revenue: 35982 },
    { name: "F1 Circuit - Monaco", sold: 15, revenue: 43485 },
    { name: "Midnight Bloom Abstract", sold: 22, revenue: 9878 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-white border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-[var(--color-text-muted)]" />
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)]">
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-bold font-heading">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-[var(--color-accent)] font-medium hover:underline">View All</a>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--color-surface-muted)] transition-colors">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{order.customer} · {order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`status-pill status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-[var(--color-border)]">
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-bold font-heading">Top Products</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {topProducts.map((product, i) => (
              <div key={product.name} className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-xs font-bold text-[var(--color-text-muted)]">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{product.sold} sold</p>
                  </div>
                  <span className="text-sm font-bold">{formatPrice(product.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
