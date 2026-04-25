import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// GET all categories
export async function GET() {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image_url: body.image_url || null,
        sort_order: body.sort_order || 0,
        is_active: body.is_active !== false,
        seo_title: body.seo_title || null,
        seo_description: body.seo_description || null,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/", "layout");
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}
