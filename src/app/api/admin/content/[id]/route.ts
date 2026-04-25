import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("homepage_sections")
      .update({
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        image_url: body.image_url,
        link_url: body.link_url,
        sort_order: body.sort_order,
        is_active: body.is_active,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Content update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
