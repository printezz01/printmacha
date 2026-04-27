import { createServiceRoleClient } from "@/lib/supabase/server";

// Default homepage settings — used as fallback when no DB values exist
export const HOMEPAGE_DEFAULTS: Record<string, string> = {
  announcement_text_1: "Bengaluru · ships in 5–7 days",
  announcement_text_2: "7-day easy returns · handcrafted, not mass-made",
  hero_label: "Edition 01 — Bengaluru Studio",
  hero_heading: "Art that stands out. Literally.",
  hero_subheading:
    "Sculptural 3D-printed wall art and desk objects. Quietly precise. Made slow. Made in India.",
  hero_cta_text: "Shop the collection",
  hero_cta_link: "/shop",
  hero_image: "/images/hero-wall-art.png",
  hero_badge_text: "Make it yours",
  hero_badge_sub: "Custom size · color · finish",
  hero_product_name: "Topography No. 04",
  hero_edition: "Edition of 200",
  bento_heading: "Find your piece.",
  bento_card1_title: "3D Wall Art",
  bento_card1_count: "24 pieces",
  bento_card1_link: "/category/3d-textured-posters",
  bento_card1_image: "/images/category-3d-wall-art.png",
  bento_card2_title: "F1 Collection",
  bento_card2_count: "12 pieces",
  bento_card2_link: "/category/f1-collection",
  bento_card2_image: "/images/category-f1-collection.png",
  bento_card3_title: "Desk Lamps",
  bento_card3_count: "8 pieces",
  bento_card3_link: "/category/desk-accessories",
  bento_card3_image: "/images/category-desk-lamps.png",
  bestsellers_heading: "Quietly loved.",
  arrivals_label: "Just In",
  arrivals_heading: "New arrivals",
  about_heading: "Depth, because flat is forgettable.",
  about_description:
    "Designed in-house, printed slow on industrial machines. Tactile, sculptural decor that turns walls into conversations.",
  stat_1_value: "0.1mm",
  stat_1_label: "Print Precision",
  stat_2_value: "100%",
  stat_2_label: "Made in India",
  stat_3_value: "48hr",
  stat_3_label: "Print to Ship",
  stat_4_value: "PLA",
  stat_4_label: "Biodegradable",
  step_1_title: "Layer by layer",
  step_1_desc: "Each piece prints over 12–48 hours. No moulds, no shortcuts.",
  step_2_title: "Texture you can feel",
  step_2_desc: "True 3D relief — light moves across every ridge.",
  step_3_title: "Plant-based PLA",
  step_3_desc:
    "Biodegradable cornstarch filament. Premium feel, gentle footprint.",
};

/**
 * Fetch homepage settings from Supabase (server-side).
 * Falls back to HOMEPAGE_DEFAULTS if DB is empty or unavailable.
 */
export async function getHomepageSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error || !data || data.length === 0) {
      return { ...HOMEPAGE_DEFAULTS };
    }

    const merged = { ...HOMEPAGE_DEFAULTS };
    for (const row of data) {
      if (row.key && row.value) {
        merged[row.key] = row.value;
      }
    }
    return merged;
  } catch {
    return { ...HOMEPAGE_DEFAULTS };
  }
}
