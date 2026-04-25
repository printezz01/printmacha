"use client";

import { useState, useEffect } from "react";
import { Save, Pencil, GripVertical, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminContentPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch sections: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      content: formData.get("content"),
      link_url: formData.get("link_url"),
      is_active: formData.get("is_active") === "on",
    };

    try {
      const response = await fetch(`/api/admin/content/${editingSection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Section updated");
        setIsModalOpen(false);
        setEditingSection(null);
        fetchSections();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error("Failed to save section: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-6">Homepage Content</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">
        Manage homepage sections. Edit titles, subtitles, and toggle visibility.
      </p>

      <div className="bg-white rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-accent)]" />
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)]">
            No homepage sections configured in database.
          </div>
        ) : (
          sections.map((section, i) => (
            <div key={section.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-surface-muted)] transition-colors">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-[var(--color-text-muted)] cursor-grab" />
                <div>
                  <p className="font-medium text-sm">{section.title || section.type}</p>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase">{section.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${section.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {section.is_active ? "Active" : "Inactive"}
                </span>
                <button 
                  onClick={() => { setEditingSection(section); setIsModalOpen(true); }}
                  className="btn btn-ghost btn-sm"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-6 text-sm text-[var(--color-text-muted)] italic">
        * Drag and drop reordering is coming soon.
      </p>

      {/* Content Edit Modal */}
      {isModalOpen && editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-xl font-bold font-[var(--font-heading)] uppercase">
                Edit {editingSection.type} Section
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingSection.title} 
                  className="input" 
                  placeholder="Section title" 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subtitle / Description</label>
                <textarea 
                  name="subtitle" 
                  defaultValue={editingSection.subtitle} 
                  className="input" 
                  rows={2} 
                  placeholder="Short description" 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Link URL</label>
                <input 
                  type="text" 
                  name="link_url" 
                  defaultValue={editingSection.link_url} 
                  className="input" 
                  placeholder="/shop" 
                />
              </div>
              
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={editingSection.is_active} 
                  className="accent-[var(--color-accent)]" 
                />
                Show this section on homepage
              </label>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn btn-primary flex-1"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
