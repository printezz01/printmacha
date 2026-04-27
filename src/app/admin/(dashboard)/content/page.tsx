"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Image as ImageIcon,
  Type,
  Layout,
  Megaphone,
  RefreshCw,
  Check,
  Eye,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import Link from "next/link";

interface SettingsMap {
  [key: string]: string;
}

// Default values that match the current hardcoded content
const DEFAULTS: SettingsMap = {
  // Announcement bar
  announcement_text_1: "Bengaluru · ships in 5–7 days",
  announcement_text_2: "7-day easy returns · handcrafted, not mass-made",

  // Hero section
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

  // Category bento
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

  // Best sellers
  bestsellers_heading: "Quietly loved.",

  // New arrivals
  arrivals_label: "Just In",
  arrivals_heading: "New arrivals",

  // About / process
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
  step_1_desc:
    "Each piece prints over 12–48 hours. No moulds, no shortcuts.",
  step_2_title: "Texture you can feel",
  step_2_desc: "True 3D relief — light moves across every ridge.",
  step_3_title: "Plant-based PLA",
  step_3_desc:
    "Biodegradable cornstarch filament. Premium feel, gentle footprint.",
};

export default function AdminContentPage() {
  const [settings, setSettings] = useState<SettingsMap>({ ...DEFAULTS });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("hero");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(({ settings: saved }) => {
        if (saved && Object.keys(saved).length > 0) {
          setSettings((prev) => ({ ...prev, ...saved }));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Homepage content saved! Changes will appear on the site.");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "announcement", label: "Announcement Bar", icon: Megaphone },
    { id: "hero", label: "Hero Banner", icon: Layout },
    { id: "categories", label: "Category Cards", icon: ImageIcon },
    { id: "sections", label: "Section Headings", icon: Type },
    { id: "about", label: "About & Process", icon: Type },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Edit Homepage
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Change what your customers see on the front page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="btn btn-ghost btn-sm"
          >
            <Eye className="w-4 h-4" /> Preview Site
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-[var(--color-border)] p-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[var(--color-text-primary)] text-white"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* ─── ANNOUNCEMENT BAR ─────────────────────────── */}
        {activeTab === "announcement" && (
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
            <div>
              <h2 className="font-bold mb-1">Top Announcement Bar</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                The scrolling text strip at the very top of the site
              </p>
            </div>
            <Field
              label="Text 1 (left side)"
              value={settings.announcement_text_1}
              onChange={(v) => updateField("announcement_text_1", v)}
              placeholder="e.g. Bengaluru · ships in 5–7 days"
            />
            <Field
              label="Text 2 (right side)"
              value={settings.announcement_text_2}
              onChange={(v) => updateField("announcement_text_2", v)}
              placeholder="e.g. 7-day easy returns"
            />
          </div>
        )}

        {/* ─── HERO ─────────────────────────────────────── */}
        {activeTab === "hero" && (
          <>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
              <div>
                <h2 className="font-bold mb-1">Hero Section</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  The big banner your customers see first
                </p>
              </div>
              <Field
                label="Edition Label (small text above heading)"
                value={settings.hero_label}
                onChange={(v) => updateField("hero_label", v)}
                placeholder="e.g. Edition 01 — Bengaluru Studio"
              />
              <Field
                label="Main Heading"
                value={settings.hero_heading}
                onChange={(v) => updateField("hero_heading", v)}
                placeholder="e.g. Art that stands out. Literally."
              />
              <Field
                label="Subheading"
                value={settings.hero_subheading}
                onChange={(v) => updateField("hero_subheading", v)}
                placeholder="Short description below the heading"
                multiline
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Button Text"
                  value={settings.hero_cta_text}
                  onChange={(v) => updateField("hero_cta_text", v)}
                />
                <Field
                  label="Button Link"
                  value={settings.hero_cta_link}
                  onChange={(v) => updateField("hero_cta_link", v)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
              <div>
                <h2 className="font-bold mb-1">Hero Image</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  The large product photo on the right side of the hero
                </p>
              </div>
              <ImageUpload
                value={settings.hero_image || null}
                onChange={(url) =>
                  updateField("hero_image", url || "/images/hero-wall-art.png")
                }
                bucket="site-content"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Product Name (bottom bar)"
                  value={settings.hero_product_name}
                  onChange={(v) => updateField("hero_product_name", v)}
                />
                <Field
                  label="Edition Text"
                  value={settings.hero_edition}
                  onChange={(v) => updateField("hero_edition", v)}
                />
              </div>
            </div>
          </>
        )}

        {/* ─── CATEGORIES ───────────────────────────────── */}
        {activeTab === "categories" && (
          <>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
              <div>
                <h2 className="font-bold mb-1">Category Grid</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  The &quot;Find your piece&quot; section with 3 category cards
                </p>
              </div>
              <Field
                label="Section Heading"
                value={settings.bento_heading}
                onChange={(v) => updateField("bento_heading", v)}
              />
            </div>

            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4"
              >
                <h3 className="font-bold text-sm">
                  Category Card {n}{" "}
                  {n === 1 && (
                    <span className="text-xs font-normal text-[var(--color-text-muted)]">
                      (large, left side)
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Title"
                    value={settings[`bento_card${n}_title`]}
                    onChange={(v) =>
                      updateField(`bento_card${n}_title`, v)
                    }
                  />
                  <Field
                    label="Piece Count"
                    value={settings[`bento_card${n}_count`]}
                    onChange={(v) =>
                      updateField(`bento_card${n}_count`, v)
                    }
                    placeholder="e.g. 24 pieces"
                  />
                </div>
                <Field
                  label="Link (where it goes when clicked)"
                  value={settings[`bento_card${n}_link`]}
                  onChange={(v) => updateField(`bento_card${n}_link`, v)}
                  placeholder="e.g. /category/3d-textured-posters"
                />
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Card Image
                  </label>
                  <ImageUpload
                    value={settings[`bento_card${n}_image`] || null}
                    onChange={(url) =>
                      updateField(
                        `bento_card${n}_image`,
                        url || ""
                      )
                    }
                    bucket="site-content"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {/* ─── SECTION HEADINGS ─────────────────────────── */}
        {activeTab === "sections" && (
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-6">
            <div>
              <h2 className="font-bold mb-1">Section Headings</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                The big titles shown above product grids
              </p>
            </div>
            <Field
              label='Best Sellers Section Heading'
              value={settings.bestsellers_heading}
              onChange={(v) => updateField("bestsellers_heading", v)}
            />
            <hr className="border-[var(--color-border)]" />
            <Field
              label="New Arrivals Small Label"
              value={settings.arrivals_label}
              onChange={(v) => updateField("arrivals_label", v)}
            />
            <Field
              label="New Arrivals Heading"
              value={settings.arrivals_heading}
              onChange={(v) => updateField("arrivals_heading", v)}
            />
          </div>
        )}

        {/* ─── ABOUT / PROCESS ──────────────────────────── */}
        {activeTab === "about" && (
          <>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
              <div>
                <h2 className="font-bold mb-1">About Section</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  The &quot;Depth, because flat is forgettable&quot; section
                </p>
              </div>
              <Field
                label="Heading"
                value={settings.about_heading}
                onChange={(v) => updateField("about_heading", v)}
              />
              <Field
                label="Description"
                value={settings.about_description}
                onChange={(v) => updateField("about_description", v)}
                multiline
              />
            </div>

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
              <h3 className="font-bold">Stats (the 4 numbers)</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-2 p-3 bg-[var(--color-surface-muted)] rounded-xl">
                    <Field
                      label={`Stat ${n} — Value`}
                      value={settings[`stat_${n}_value`]}
                      onChange={(v) => updateField(`stat_${n}_value`, v)}
                      placeholder="e.g. 0.1mm"
                    />
                    <Field
                      label={`Stat ${n} — Label`}
                      value={settings[`stat_${n}_label`]}
                      onChange={(v) => updateField(`stat_${n}_label`, v)}
                      placeholder="e.g. Print Precision"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-5">
              <h3 className="font-bold">Process Steps (the 3 steps on the right)</h3>
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-4 bg-[var(--color-surface-muted)] rounded-xl space-y-3">
                  <p className="text-xs font-bold text-[var(--color-text-muted)]">STEP 0{n}</p>
                  <Field
                    label="Title"
                    value={settings[`step_${n}_title`]}
                    onChange={(v) => updateField(`step_${n}_title`, v)}
                  />
                  <Field
                    label="Description"
                    value={settings[`step_${n}_desc`]}
                    onChange={(v) => updateField(`step_${n}_desc`, v)}
                    multiline
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 mt-8">
        <div className="bg-[var(--color-text-primary)] text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl">
          <p className="text-sm">
            Don't forget to save your changes
          </p>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Field Component ────────────────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      {multiline ? (
        <textarea
          className="input"
          rows={3}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
