import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// GET all products (admin)
export async function GET() {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories!products_category_id_fkey(id, name, slug)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("products")
      .insert({
        title: body.title,
        slug: body.slug,
        short_description: body.short_description || null,
        long_description: body.long_description || null,
        category_id: body.category_id || null,
        tags: body.tags || [],
        sku: body.sku,
        base_price: body.base_price,
        sale_price: body.sale_price || null,
        compare_at_price: body.compare_at_price || null,
        stock_quantity: body.stock_quantity || 0,
        stock_status: body.stock_status || "in_stock",
        featured_image: body.featured_image || null,
        is_featured: body.is_featured || false,
        is_new_arrival: body.is_new_arrival || false,
        is_best_seller: body.is_best_seller || false,
        is_published: body.is_published || false,
        material: body.material || null,
        size: body.size || null,
        color: body.color || null,
        finish: body.finish || null,
        delivery_estimate: body.delivery_estimate || "5-7 business days",
        return_eligible: body.return_eligible !== false,
        seo_title: body.seo_title || null,
        seo_description: body.seo_description || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
