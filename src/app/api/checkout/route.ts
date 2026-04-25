import { NextRequest, NextResponse } from "next/server";
import { createCashfreeOrder } from "@/lib/cashfree";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shipping_address,
      payment_method,
      coupon_code,
      guest_email,
      guest_phone,
      notes,
    } = body;

    // Validate required fields
    if (!items || !items.length || !shipping_address || !payment_method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // TODO: Validate products/prices against database
    // TODO: Check stock availability
    // TODO: Apply coupon and validate
    // TODO: Calculate totals server-side
    // TODO: Create order in Supabase
    // TODO: Create payment record

    if (payment_method === "prepaid") {
      // Create Cashfree payment session
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "https://printmacha.onrender.com";
        
        const cashfreeOrder = await createCashfreeOrder({
          orderId: orderNumber,
          orderAmount: body.total || 0,
          customerName: shipping_address.full_name || "Guest User",
          customerEmail: guest_email || "customer@printmacha.com",
          customerPhone: guest_phone || shipping_address.phone || "9999999999",
          returnUrl: `${siteUrl}/checkout/success`,
        });

        return NextResponse.json({
          success: true,
          order_number: orderNumber,
          payment_session_id: cashfreeOrder.payment_session_id,
          cf_order_id: cashfreeOrder.cf_order_id,
        });
      } catch (error: any) {
        console.error("Cashfree order creation failed:", error);
        return NextResponse.json(
          { error: "Payment initiation failed", details: error?.message || String(error) },
          { status: 500 }
        );
      }
    } else {
      // COD order
      // TODO: Create order with cod_pending payment status
      return NextResponse.json({
        success: true,
        order_number: orderNumber,
        payment_method: "cod",
      });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
