import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// GET single order with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    // Try by order_number first, then by UUID
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", id)
      .single();

    let { data, error } = await query;

    // If not found by order_number, try by id
    if (error || !data) {
      const result = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update order status, tracking, notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceRoleClient();
    const body = await request.json();

    const updates: any = { updated_at: new Date().toISOString() };

    if (body.status) updates.status = body.status;
    if (body.tracking_number !== undefined) updates.tracking_number = body.tracking_number;
    if (body.tracking_url !== undefined) updates.tracking_url = body.tracking_url;
    if (body.notes !== undefined) updates.notes = body.notes;

    // Try update by order_number first
    let { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("order_number", id)
      .select()
      .single();

    // If not found, try by UUID
    if (error) {
      const result = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
