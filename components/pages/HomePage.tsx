"use client";

import { CategoriesGrid } from "@/components/category/CategoriesGrid";
import { FeaturedAds } from "@/components/advert/FeaturedAds";

export function HomePage() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Find Everything You Need
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing deals in your area. Buy, sell, and connect with your community.
        </p>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
        <CategoriesGrid />
      </section>

      {/* Featured Ads */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Ads</h2>
        <FeaturedAds />
      </section>
    </div>
  );
}
