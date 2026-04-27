import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServiceRoleClient();

    // Run all queries in parallel
    const [
      productsRes,
      ordersRes,
      revenueRes,
      customersRes,
      recentOrdersRes,
      topProductsRes,
    ] = await Promise.all([
      // Total published products
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),

      // Total orders
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true }),

      // Total revenue (sum of paid orders)
      supabase
        .from("orders")
        .select("total")
        .in("status", ["confirmed", "processing", "shipped", "delivered"]),

      // Unique customers (users with orders)
      supabase
        .from("orders")
        .select("user_id")
        .not("user_id", "is", null),

      // Recent 5 orders
      supabase
        .from("orders")
        .select("id, order_number, status, total, created_at, guest_email, shipping_address")
        .order("created_at", { ascending: false })
        .limit(5),

      // Top products by order count
      supabase
        .from("order_items")
        .select("product_title, quantity, total_price"),
    ]);

    // Calculate revenue
    const totalRevenue = (revenueRes.data || []).reduce(
      (sum: number, o: any) => sum + (o.total || 0),
      0
    );

    // Unique customer count
    const uniqueCustomers = new Set(
      (customersRes.data || []).map((o: any) => o.user_id)
    ).size;

    // Aggregate top products
    const productMap = new Map<string, { sold: number; revenue: number }>();
    for (const item of topProductsRes.data || []) {
      const existing = productMap.get(item.product_title) || { sold: 0, revenue: 0 };
      existing.sold += item.quantity || 0;
      existing.revenue += item.total_price || 0;
      productMap.set(item.product_title, existing);
    }
    const topProducts = Array.from(productMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Format recent orders
    const recentOrders = (recentOrdersRes.data || []).map((o: any) => ({
      id: o.order_number || o.id,
      customer: o.shipping_address?.full_name || o.guest_email || "Guest",
      total: o.total,
      status: o.status,
      date: new Date(o.created_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
    }));

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders: ordersRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalCustomers: uniqueCustomers,
      },
      recentOrders,
      topProducts,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
