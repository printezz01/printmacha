import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Shiprocket Webhook Handler
 * 
 * Receives tracking updates from Shiprocket and auto-updates order status.
 * Setup: Shiprocket Dashboard → Settings → API → Webhooks → Add URL
 * URL: https://printmacha.com/api/webhooks/shiprocket-tracking
 */

// Map Shiprocket status IDs to our order statuses
function mapShiprocketStatus(statusId: number): string | null {
  // Shiprocket status reference:
  // 1 = AWB Assigned, 5 = Manifest Generated
  // 6 = Shipped, 42 = Picked Up
  // 18 = In Transit
  // 7 = Delivered, 8 = Delivered
  // 9 = Undelivered, 10 = RTO Initiated
  // 13 = RTO Delivered, 14 = Lost
  // 15 = Cancellation Requested, 16 = Cancelled
  // 19 = Out for Delivery

  if ([6, 42].includes(statusId)) return "shipped";
  if ([18, 19, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48].includes(statusId)) return "shipped"; // in transit variations
  if ([7, 8].includes(statusId)) return "delivered";
  if ([15, 16].includes(statusId)) return "cancelled";
  // We don't auto-update for RTO/undelivered — admin handles that
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook (optional security token)
    const securityToken = request.headers.get("x-api-key");
    const expectedToken = process.env.SHIPROCKET_WEBHOOK_SECRET;
    if (expectedToken && securityToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      awb,
      courier_name,
      current_status,
      current_status_id,
      shipment_status_id,
      order_id,
      etd,
      scans,
    } = body;

    console.log(`[Shiprocket Webhook] AWB: ${awb}, Status: ${current_status} (${current_status_id})`);

    if (!awb) {
      return NextResponse.json({ success: true }); // Acknowledge but ignore
    }

    const supabase = await createServiceRoleClient();

    // Find order by tracking_number (AWB)
    const { data: order } = await supabase
      .from("orders")
      .select("id, status, order_number")
      .eq("tracking_number", awb)
      .single();

    if (!order) {
      console.log(`[Shiprocket Webhook] No order found for AWB: ${awb}`);
      return NextResponse.json({ success: true }); // Acknowledge
    }

    // Determine new status
    const newStatus = mapShiprocketStatus(current_status_id || shipment_status_id);

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    // Update status if we have a mapping and it's a forward progression
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
    if (newStatus) {
      const currentIdx = statusOrder.indexOf(order.status);
      const newIdx = statusOrder.indexOf(newStatus);
      // Only advance status, never go backwards (except cancelled)
      if (newIdx > currentIdx || newStatus === "cancelled") {
        updates.status = newStatus;
      }
    }

    // Mark delivered timestamp
    if (newStatus === "delivered") {
      updates.delivered_at = new Date().toISOString();
    }

    // Store courier name if available
    if (courier_name) {
      updates.courier_name = courier_name;
    }

    // Store ETD if available
    if (etd) {
      updates.estimated_delivery = etd;
    }

    await supabase
      .from("orders")
      .update(updates)
      .eq("id", order.id);

    console.log(`[Shiprocket Webhook] Updated order ${order.order_number}: ${JSON.stringify(updates)}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Shiprocket Webhook] Error:", error.message);
    // Always return 200 so Shiprocket doesn't retry
    return NextResponse.json({ success: true });
  }
}
