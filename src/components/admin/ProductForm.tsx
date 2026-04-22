"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  category_id: string;
  tags: string;
  sku: string;
  base_price: string;
  sale_price: string;
  stock_quantity: string;
  featured_image: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_published: boolean;
  return_eligible: boolean;
  material: string;
  size: string;
  color: string;
  finish: string;
  delivery_estimate: string;
  seo_title: string;
  seo_description: string;
}

const defaultFormData: ProductFormData = {
  title: "",
  slug: "",
  short_description: "",
  long_description: "",
  category_id: "",
  tags: "",
  sku: "",
  base_price: "",
  sale_price: "",
  stock_quantity: "0",
  featured_image: null,
  is_featured: false,
  is_new_arrival: false,
  is_best_seller: false,
  is_published: false,
  return_eligible: true,
  material: "",
  size: "",
  color: "",
  finish: "",
  delivery_estimate: "5-7 business days",
  seo_title: "",
  seo_description: "",
};

interface ProductFormProps {
  productId?: string; // If provided, we're editing
  initialData?: Partial<ProductFormData>;
}

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;

  const [form, setForm] = useState<ProductFormData>({ ...defaultFormData, ...initialData });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCategories(data.data);
      })
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setIsLoadingCategories(false));
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug === slugify(prev.title) || !prev.slug ? slugify(title) : prev.slug,
    }));
  };

  const updateField = (field: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    if (!form.sku.trim()) { toast.error("SKU is required"); return; }
    if (!form.base_price || parseFloat(form.base_price) <= 0) { toast.error("Base price must be greater than 0"); return; }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        base_price: parseFloat(form.base_price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        compare_at_price: form.sale_price ? parseFloat(form.base_price) : null,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        category_id: form.category_id || null,
      };

      const url = isEditing ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save");

      toast.success(isEditing ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Product deleted!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="btn btn-ghost btn-icon">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
        </div>
        {isEditing && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-outline text-[var(--color-error)] border-[var(--color-error)] hover:bg-red-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
            <h2 className="font-bold">Basic Information</h2>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title *</label>
              <input
                type="text"
                className="input"
                placeholder="Product title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Slug</label>
              <input
                type="text"
                className="input"
                placeholder="product-slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Short Description</label>
              <textarea
                className="input"
                rows={2}
                placeholder="Brief product summary..."
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Description</label>
              <textarea
                className="input"
                rows={6}
                placeholder="Detailed product description..."
                value={form.long_description}
                onChange={(e) => updateField("long_description", e.target.value)}
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
            <h2 className="font-bold">Featured Image</h2>
            <ImageUpload
              value={form.featured_image}
              onChange={(url) => updateField("featured_image", url)}
              bucket="product-images"
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
            <h2 className="font-bold">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Base Price (₹) *</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0"
                  value={form.base_price}
                  onChange={(e) => updateField("base_price", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Sale Price (₹)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Leave empty for no sale"
                  value={form.sale_price}
                  onChange={(e) => updateField("sale_price", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">SKU *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="PM-XXX-001"
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Stock Quantity</label>
                <input
                  type="number"
                  className="input"
                  value={form.stock_quantity}
                  onChange={(e) => updateField("stock_quantity", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
            <h2 className="font-bold">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Material</label>
                <input type="text" className="input" placeholder="e.g., PLA Biodegradable" value={form.material} onChange={(e) => updateField("material", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Size</label>
                <input type="text" className="input" placeholder="e.g., 12×16 inches" value={form.size} onChange={(e) => updateField("size", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Color</label>
                <input type="text" className="input" placeholder="e.g., Warm White" value={form.color} onChange={(e) => updateField("color", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Finish</label>
                <input type="text" className="input" placeholder="e.g., Matte" value={form.finish} onChange={(e) => updateField("finish", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Delivery Estimate</label>
                <input type="text" className="input" value={form.delivery_estimate} onChange={(e) => updateField("delivery_estimate", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tags (comma-separated)</label>
                <input type="text" className="input" placeholder="abstract, wall-art, premium" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
            <h2 className="font-bold">SEO</h2>
            <div>
              <label className="text-sm font-medium mb-1.5 block">SEO Title</label>
              <input type="text" className="input" placeholder="Product title for search engines" value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">SEO Description</label>
              <textarea className="input" rows={2} placeholder="Meta description for search engines..." value={form.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4 sticky top-24">
            <h2 className="font-bold">Publish</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[var(--color-accent)]" checked={form.is_published} onChange={(e) => updateField("is_published", e.target.checked)} />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[var(--color-accent)]" checked={form.is_featured} onChange={(e) => updateField("is_featured", e.target.checked)} />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[var(--color-accent)]" checked={form.is_new_arrival} onChange={(e) => updateField("is_new_arrival", e.target.checked)} />
                <span className="text-sm">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[var(--color-accent)]" checked={form.is_best_seller} onChange={(e) => updateField("is_best_seller", e.target.checked)} />
                <span className="text-sm">Best Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[var(--color-accent)]" checked={form.return_eligible} onChange={(e) => updateField("return_eligible", e.target.checked)} />
                <span className="text-sm">Return Eligible</span>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <select
                className="input"
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                disabled={isLoadingCategories}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full btn btn-primary"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> {isEditing ? "Update Product" : "Save Product"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
