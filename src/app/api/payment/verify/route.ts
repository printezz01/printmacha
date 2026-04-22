import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreePayment } from "@/lib/cashfree";

export async function POST(request: NextRequest) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { error: "Missing order_id" },
        { status: 400 }
      );
    }

    // Verify payment on server side via Cashfree API
    const payments = await verifyCashfreePayment(order_id);

    // Check if any payment is successful
    const successfulPayment = payments?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.payment_status === "SUCCESS"
    );

    if (successfulPayment) {
      // TODO: Double-check against database
      // TODO: Ensure order is marked as confirmed
      return NextResponse.json({
        success: true,
        status: "paid",
        order_id,
      });
    }

    return NextResponse.json({
      success: true,
      status: "pending",
      order_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
