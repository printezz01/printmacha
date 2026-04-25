import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("coupons")
      .insert([
        {
          code: body.code.toUpperCase(),
          type: body.type,
          value: body.value,
          min_order_amount: body.min_order_amount || 0,
          max_discount_amount: body.max_discount_amount || null,
          usage_limit: body.usage_limit || null,
          valid_from: body.valid_from || new Date().toISOString(),
          valid_until: body.valid_until || null,
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Coupon creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
