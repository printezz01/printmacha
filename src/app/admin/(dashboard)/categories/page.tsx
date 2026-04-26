"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, FolderOpen } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import { sampleCategories } from "@/lib/sample-data";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
}

const emptyForm = { name: "", slug: "", description: "", image_url: null as string | null, sort_order: 0, is_active: true, seo_title: "", seo_description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = () => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setCategories(data.data);
        } else {
          setCategories(sampleCategories as any);
        }
      })
      .catch(() => setCategories(sampleCategories as any))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image_url: cat.image_url,
      sort_order: cat.sort_order,
      is_active: cat.is_active,
      seo_title: cat.seo_title || "",
      seo_description: cat.seo_description || "",
    });
    setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === slugify(prev.name) || !prev.slug ? slugify(name) : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }

    setIsSaving(true);
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      toast.success(editingId ? "Category updated!" : "Category created!");
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Categories</h1>
        <button onClick={openNew} className="btn btn-primary">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="mb-8 bg-white rounded-xl border border-[var(--color-border)] p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">{editingId ? "Edit Category" : "New Category"}</h2>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn btn-ghost btn-icon">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name *</label>
                <input type="text" className="input" placeholder="Category name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Slug</label>
                <input type="text" className="input" placeholder="category-slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea className="input" rows={3} placeholder="Category description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Sort Order</label>
                  <input type="number" className="input" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--color-accent)]" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category Image</label>
                <ImageUpload value={form.image_url} onChange={(url) => setForm((p) => ({ ...p, image_url: url }))} bucket="category-images" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn btn-outline">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {editingId ? "Update" : "Create"}</>}
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Category</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Slug</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Order</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Status</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--color-surface-muted)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-muted)] shrink-0 overflow-hidden flex items-center justify-center">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <FolderOpen className="w-4 h-4 text-[var(--color-warm-400)]" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium">{cat.name}</span>
                        {cat.description && <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[250px]">{cat.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">{cat.slug}</td>
                  <td className="p-4">{cat.sort_order}</td>
                  <td className="p-4">
                    <span className={`status-pill ${cat.is_active ? "status-confirmed" : "status-pending"}`}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(cat)} className="btn btn-ghost btn-sm btn-icon" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="btn btn-ghost btn-sm btn-icon text-[var(--color-text-muted)] hover:text-[var(--color-error)]" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
            <p className="font-medium">No categories yet</p>
            <p className="text-sm text-[var(--color-text-muted)]">Create your first category to organize products.</p>
          </div>
        )}
      </div>
    </div>
  );
}
