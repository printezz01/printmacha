import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";

// Disable body parsing to get raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get("x-webhook-timestamp") || "";
    const signature = request.headers.get("x-webhook-signature") || "";

    // Verify webhook signature
    if (!verifyCashfreeWebhookSignature(rawBody, timestamp, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const { data } = payload;

    if (!data || !data.order) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const {
      order: { order_id, order_amount },
      payment: { cf_payment_id, payment_status, payment_amount },
    } = data;

    console.log(
      `Webhook received: order=${order_id}, status=${payment_status}, amount=${payment_amount}`
    );

    // Idempotency check: Only process if payment status is terminal
    if (payment_status === "SUCCESS") {
      // TODO: Fetch order from Supabase by order_number
      // TODO: Check if payment is already marked as paid (idempotency)
      // TODO: Verify payment_amount matches order total
      // TODO: Update payment record: status = 'paid', cashfree_payment_id, verified_at
      // TODO: Update order status to 'confirmed'
      // TODO: Decrement stock quantities
      // TODO: Send confirmation email/SMS
      console.log(`Payment SUCCESS for order ${order_id}`);
    } else if (payment_status === "FAILED") {
      // TODO: Update payment record: status = 'failed'
      // TODO: Keep order status as 'pending'
      console.log(`Payment FAILED for order ${order_id}`);
    } else if (payment_status === "USER_DROPPED") {
      // TODO: Update payment record: status = 'failed'
      console.log(`Payment DROPPED for order ${order_id}`);
    }

    // Always return 200 to acknowledge webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 even on error to prevent retries for malformed webhooks
    return NextResponse.json({ success: true });
  }
}
