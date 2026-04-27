import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  createShipment,
  assignCourier,
  trackByAwb,
  dbOrderToShiprocket,
  cancelShiprocketOrder,
  generateLabel,
  schedulePickup,
} from "@/lib/shiprocket";

// POST /api/admin/shipping — Ship an order via Shiprocket
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await request.json();
    const { order_number, dimensions } = body;

    if (!order_number) {
      return NextResponse.json({ error: "order_number required" }, { status: 400 });
    }

    // Default dimensions for 3D printed items
    const dims = {
      length: dimensions?.length || 15,
      breadth: dimensions?.breadth || 15,
      height: dimensions?.height || 10,
      weight: dimensions?.weight || 0.5,
    };

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", order_number)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Prevent duplicate shipment
    if (order.shiprocket_order_id) {
      return NextResponse.json({
        error: "Shipment already created",
        shiprocket_order_id: order.shiprocket_order_id,
      }, { status: 400 });
    }

    // 1. Create order on Shiprocket
    const srOrder = dbOrderToShiprocket(order, order.order_items || [], dims);
    const createRes = await createShipment(srOrder);

    const shiprocketOrderId = createRes.order_id;
    const shipmentId = createRes.shipment_id;

    // 2. Auto-assign courier (cheapest)
    let awb = "";
    let courierName = "";
    let trackingUrl = "";

    if (shipmentId) {
      try {
        const assignRes = await assignCourier(shipmentId);
        awb = assignRes.response?.data?.awb_code || "";
        courierName = assignRes.response?.data?.courier_name || "";

        if (awb) {
          trackingUrl = `https://shiprocket.co/tracking/${awb}`;
        }

        // 3. Schedule pickup
        await schedulePickup(shipmentId).catch(() => {});

        // 4. Generate label
        await generateLabel(shipmentId).catch(() => {});
      } catch (err: any) {
        console.error("Courier assignment failed:", err.message);
        // Order is created but courier not assigned — admin can do it manually
      }
    }

    // 5. Update order in database
    await supabase
      .from("orders")
      .update({
        status: awb ? "shipped" : "processing",
        tracking_number: awb || null,
        tracking_url: trackingUrl || null,
        shiprocket_order_id: shiprocketOrderId,
        shiprocket_shipment_id: shipmentId,
        courier_name: courierName || null,
        shipped_at: awb ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", order_number);

    return NextResponse.json({
      success: true,
      shiprocket_order_id: shiprocketOrderId,
      shipment_id: shipmentId,
      awb,
      courier_name: courierName,
      tracking_url: trackingUrl,
      status: awb ? "shipped" : "processing",
    });
  } catch (error: any) {
    console.error("Shipping error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
