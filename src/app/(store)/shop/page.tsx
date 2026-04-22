"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, Grid3X3, Loader2 } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import type { Product, Category } from "@/types/database";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "best-selling";

export default function ShopPage() {
  const [sort, setSort] = useState<SortOption>("featured");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API, then fall back to sample data if needed
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()).catch(() => ({ data: null })),
      fetch("/api/admin/categories").then((r) => r.json()).catch(() => ({ data: null })),
    ]).then(async ([prodRes, catRes]) => {
      if (prodRes.data && prodRes.data.length > 0) {
        // Filter only published products for storefront
        setAllProducts(prodRes.data.filter((p: any) => p.is_published));
      } else {
        // Fallback to sample data
        const { sampleProducts } = await import("@/lib/sample-data");
        setAllProducts(sampleProducts);
      }

      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data.filter((c: any) => c.is_active));
      } else {
        const { sampleCategories } = await import("@/lib/sample-data");
        setCategories(sampleCategories);
      }

      setIsLoading(false);
    });
  }, []);

  const products = useMemo(() => {
    const items = [...allProducts];
    switch (sort) {
      case "price-asc":
        return items.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
      case "price-desc":
        return items.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
      case "newest":
        return items.sort((a, b) => (a.is_new_arrival === b.is_new_arrival ? 0 : a.is_new_arrival ? -1 : 1));
      case "best-selling":
        return items.sort((a, b) => (a.is_best_seller === b.is_best_seller ? 0 : a.is_best_seller ? -1 : 1));
      default:
        return items.sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));
    }
  }, [sort, allProducts]);

  if (isLoading) {
    return (
      <div className="container-wide py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)] font-medium">Shop</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] mb-2">
          All Products
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {products.length} products
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 overflow-x-auto">
          <Link href="/shop" className="btn btn-outline btn-sm whitespace-nowrap">
            <SlidersHorizontal className="w-4 h-4" />
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="btn btn-ghost btn-sm whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            className="input py-2 px-3 text-sm w-auto min-w-[150px]"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} listName="Shop All" />
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
            <Grid3X3 className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Try adjusting your filters or explore our categories.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Clear Filters
          </Link>
        </div>
      )}
    </div>
  );
}
