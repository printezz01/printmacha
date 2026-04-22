"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, Loader2, Package, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { sampleProducts } from "@/lib/sample-data";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  base_price: number;
  sale_price: number | null;
  stock_quantity: number;
  is_published: boolean;
  is_featured: boolean;
  featured_image: string | null;
  category: { id: string; name: string; slug: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setProducts(data.data);
        } else {
          // Fallback to sample data
          setProducts(sampleProducts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            sku: p.sku,
            base_price: p.base_price,
            sale_price: p.sale_price,
            stock_quantity: p.stock_quantity,
            is_published: p.is_published,
            is_featured: p.is_featured,
            featured_image: p.featured_image,
            category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
          })));
          setUsingSampleData(true);
        }
      })
      .catch(() => {
        // Fallback to sample data on error
        setProducts(sampleProducts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          sku: p.sku,
          base_price: p.base_price,
          sale_price: p.sale_price,
          stock_quantity: p.stock_quantity,
          is_published: p.is_published,
          is_featured: p.is_featured,
          featured_image: p.featured_image,
          category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
        })));
        setUsingSampleData(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${title}" deleted`);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => { if (p.category) cats.add(p.category.name); });
    return Array.from(cats);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category?.name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

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
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Products</h1>
          {usingSampleData && (
            <p className="text-xs text-[var(--color-warning)] mt-1">⚠ Showing sample data — connect Supabase to see live data</p>
          )}
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Product</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">SKU</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Category</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Price</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Stock</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Status</th>
                <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--color-surface-muted)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-muted)] shrink-0 overflow-hidden flex items-center justify-center">
                        {product.featured_image ? (
                          <img src={product.featured_image} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-[var(--color-warm-400)]" />
                        )}
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">{product.sku}</td>
                  <td className="p-4">{product.category?.name || "—"}</td>
                  <td className="p-4 font-medium">
                    {product.sale_price ? (
                      <span className="text-[var(--color-error)]">{formatPrice(product.sale_price)}</span>
                    ) : (
                      formatPrice(product.base_price)
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${product.stock_quantity <= 5 ? "text-[var(--color-error)]" : "text-[var(--color-success)]"}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`status-pill ${product.is_published ? "status-confirmed" : "status-pending"}`}>
                      {product.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link href={`/product/${product.slug}`} className="btn btn-ghost btn-sm btn-icon" title="View on store" target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/products/${product.id}`} className="btn btn-ghost btn-sm btn-icon" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="btn btn-ghost btn-sm btn-icon text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
            <p className="font-medium">No products found</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Try a different search or add a new product.</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4">{filtered.length} of {products.length} products</p>
    </div>
  );
}
