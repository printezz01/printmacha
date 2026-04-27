import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Customer Return/Cancel Request API
 * POST /api/orders/return — Request return or cancel
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { order_number, type, reason, items } = body;

    if (!order_number || !type) {
      return NextResponse.json({ error: "order_number and type required" }, { status: 400 });
    }

    if (!["cancel", "return", "exchange"].includes(type)) {
      return NextResponse.json({ error: "type must be cancel, return, or exchange" }, { status: 400 });
    }

    // Fetch the order (user must own it)
    const serviceClient = await createServiceRoleClient();
    const { data: order, error } = await serviceClient
      .from("orders")
      .select("*")
      .eq("order_number", order_number)
      .eq("user_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Validate cancel eligibility
    if (type === "cancel") {
      if (["shipped", "delivered", "cancelled"].includes(order.status)) {
        return NextResponse.json({
          error: `Cannot cancel — order is already ${order.status}`,
        }, { status: 400 });
      }

      // Auto-cancel if still pending/confirmed
      await serviceClient
        .from("orders")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          notes: `Customer cancelled. Reason: ${reason || "Not specified"}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully",
      });
    }

    // Validate return/exchange eligibility
    if (type === "return" || type === "exchange") {
      if (order.status !== "delivered") {
        return NextResponse.json({
          error: "Returns/exchanges are only available for delivered orders",
        }, { status: 400 });
      }

      // Check 7-day return window
      const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : new Date(order.updated_at);
      const daysSinceDelivery = Math.floor((Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceDelivery > 7) {
        return NextResponse.json({
          error: "Return window expired. Returns are only accepted within 7 days of delivery.",
        }, { status: 400 });
      }

      // Create return request in database
      await serviceClient.from("return_requests").insert({
        order_id: order.id,
        order_number: order.order_number,
        user_id: user.id,
        type,
        reason: reason || "Not specified",
        items: items || null,
        status: "pending",
      });

      // Update order notes
      await serviceClient
        .from("orders")
        .update({
          notes: `${type.toUpperCase()} requested by customer. Reason: ${reason || "Not specified"}. ${order.notes || ""}`.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return NextResponse.json({
        success: true,
        message: `${type === "return" ? "Return" : "Exchange"} request submitted. We'll review and get back to you within 24 hours.`,
      });
    }
  } catch (error: any) {
    console.error("Return/Cancel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
