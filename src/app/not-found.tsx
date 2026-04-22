import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-6">
          <span className="text-8xl md:text-9xl font-bold font-[var(--font-heading)] text-[var(--color-warm-200)]">
            404
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-3">
          Page not found
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been moved or doesn&apos;t exist.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link href="/shop" className="btn btn-outline">
            <Search className="w-4 h-4" />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
