import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// GET all orders
export async function GET() {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
