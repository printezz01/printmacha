import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, order_amount } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ success: false, error: "Invalid or expired coupon code" }, { status: 404 });
    }

    // Check expiry
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return NextResponse.json({ success: false, error: "This coupon has expired" }, { status: 400 });
    }

    // Check valid_from
    if (coupon.valid_from && new Date(coupon.valid_from) > new Date()) {
      return NextResponse.json({ success: false, error: "This coupon is not yet active" }, { status: 400 });
    }

    // Check minimum order
    if (coupon.min_order_amount && order_amount < coupon.min_order_amount) {
      return NextResponse.json({
        success: false,
        error: `Minimum order of ₹${coupon.min_order_amount} required for this coupon`,
      }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ success: false, error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round((order_amount * coupon.value) / 100);
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    } else {
      // fixed
      discount = Math.min(coupon.value, order_amount);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
      },
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
