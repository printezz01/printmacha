import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.seo_title || category?.name || "Category",
    description: category?.seo_description || category?.description || "",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const products = await getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/shop" className="btn btn-primary">Browse All Products</Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[var(--color-text-primary)] transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)] font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            {category.description}
          </p>
        )}
        <p className="text-sm text-[var(--color-text-muted)] mt-3">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <button className="btn btn-outline btn-sm">Filters</button>
        </div>
        <select className="input py-2 px-3 text-sm w-auto min-w-[150px]">
          <option>Sort: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} listName={category.name} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold mb-2">No products yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Products in this category are coming soon.
          </p>
          <Link href="/shop" className="btn btn-primary">Browse All Products</Link>
        </div>
      )}
    </div>
  );
}
