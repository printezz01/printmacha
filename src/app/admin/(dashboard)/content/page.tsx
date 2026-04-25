import { Save, Pencil, GripVertical } from "lucide-react";
import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Homepage Content | Admin" };

export default async function AdminContentPage() {
  const supabase = await createServiceRoleClient();
  const { data: sections } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });


  return (
    <div>
      <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-6">Homepage Content</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">
        Manage homepage sections. Drag to reorder, click to edit.
      </p>

      <div className="bg-white rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {sections?.map((section, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-[var(--color-surface-muted)] transition-colors">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-[var(--color-text-muted)] cursor-grab" />
              <div>
                <p className="font-medium text-sm">{section.title || section.type}</p>
                <p className="text-xs text-[var(--color-text-muted)] uppercase">{section.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={section.is_active} className="accent-[var(--color-accent)]" />
                Active
              </label>
              <button className="btn btn-ghost btn-sm"><Pencil className="w-4 h-4" /> Edit</button>
            </div>
          </div>
        ))}
        {(!sections || sections.length === 0) && (
          <div className="p-12 text-center text-[var(--color-text-muted)]">
            No homepage sections configured.
          </div>
        )}
      </div>

      <button className="btn btn-primary mt-6"><Save className="w-4 h-4" /> Save Changes</button>
    </div>
  );
}
