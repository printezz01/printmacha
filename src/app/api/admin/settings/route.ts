import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// GET all homepage settings
export async function GET() {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) throw error;

    // Convert to key-value object
    const settings: Record<string, string> = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    // Return empty settings if table doesn't exist yet
    return NextResponse.json({ settings: {} });
  }
}

// POST/PUT — upsert settings
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await request.json();

    // body.settings is an object like { "hero_heading": "Art that stands out.", ... }
    const entries = Object.entries(body.settings || {});

    for (const [key, value] of entries) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key, value: value as string, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      if (error) throw error;
    }

    // Revalidate homepage so changes appear immediately
    revalidatePath("/", "page");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings save error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}
