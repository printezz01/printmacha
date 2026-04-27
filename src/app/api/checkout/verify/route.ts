import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
  }

  try {
    const supabase = await createServiceRoleClient();

    // Look up the order by order_number
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, status")
      .eq("order_number", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ success: false, error: "Order not found" });
    }

    // If order exists and was placed, mark as confirmed
    if (order.status === "pending") {
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    }

    return NextResponse.json({ success: true, order_number: order.order_number });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
