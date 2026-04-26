// ============================================
// Supabase Data Fetching Helpers
// Falls back to sample data if Supabase is not configured
// ============================================

import { sampleProducts, sampleCategories } from "@/lib/sample-data";
import type { Product, Category } from "@/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL !== "" && SUPABASE_KEY !== "");
}

async function supabaseQuery(table: string, query: string = ""): Promise<any[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY!,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 30, tags: [`table-${table}`] },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ============================================
// Products
// ============================================

export async function getProducts(): Promise<Product[]> {
  const data = await supabaseQuery(
    "products",
    "select=*,category:categories!products_category_id_fkey(id,name,slug)&is_published=eq.true&order=created_at.desc"
  );

  if (data.length > 0) return data as Product[];
  return sampleProducts;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const data = await supabaseQuery(
    "products",
    "select=*,category:categories!products_category_id_fkey(id,name,slug)&is_published=eq.true&is_featured=eq.true&order=created_at.desc&limit=8"
  );

  if (data.length > 0) return data as Product[];
  return sampleProducts.filter((p) => p.is_featured);
}

export async function getBestSellers(): Promise<Product[]> {
  const data = await supabaseQuery(
    "products",
    "select=*,category:categories!products_category_id_fkey(id,name,slug)&is_published=eq.true&is_best_seller=eq.true&order=created_at.desc&limit=8"
  );

  if (data.length > 0) return data as Product[];
  return sampleProducts.filter((p) => p.is_best_seller);
}

export async function getNewArrivals(): Promise<Product[]> {
  const data = await supabaseQuery(
    "products",
    "select=*,category:categories!products_category_id_fkey(id,name,slug)&is_published=eq.true&is_new_arrival=eq.true&order=created_at.desc&limit=8"
  );

  if (data.length > 0) return data as Product[];
  return sampleProducts.filter((p) => p.is_new_arrival);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await supabaseQuery(
    "products",
    `select=*,category:categories!products_category_id_fkey(id,name,slug)&slug=eq.${slug}&is_published=eq.true&limit=1`
  );

  if (data.length > 0) return data[0] as Product;
  return sampleProducts.find((p) => p.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  // First get category id from slug
  const cats = await supabaseQuery("categories", `slug=eq.${categorySlug}&limit=1`);
  
  if (cats.length > 0) {
    const catId = cats[0].id;
    const data = await supabaseQuery(
      "products",
      `select=*,category:categories!products_category_id_fkey(id,name,slug)&is_published=eq.true&category_id=eq.${catId}&order=created_at.desc`
    );
    if (data.length > 0) return data as Product[];
  }

  return sampleProducts.filter((p) => p.category?.slug === categorySlug);
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string): Promise<Product[]> {
  const data = await supabaseQuery(
    "products",
    `select=*,category:categories!products_category_id_fkey(id,name,slug)&is_published=eq.true&category_id=eq.${categoryId}&id=neq.${excludeProductId}&limit=4`
  );

  if (data.length > 0) return data as Product[];
  return sampleProducts.filter((p) => p.category_id === categoryId && p.id !== excludeProductId).slice(0, 4);
}

// ============================================
// Categories
// ============================================

export async function getCategories(): Promise<Category[]> {
  const data = await supabaseQuery(
    "categories",
    "is_active=eq.true&order=sort_order.asc"
  );

  if (data.length > 0) return data as Category[];
  return sampleCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await supabaseQuery(
    "categories",
    `slug=eq.${slug}&is_active=eq.true&limit=1`
  );

  if (data.length > 0) return data[0] as Category;
  return sampleCategories.find((c) => c.slug === slug) || null;
}
