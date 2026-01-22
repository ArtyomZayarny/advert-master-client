"use client";

import { Header } from "@/components/layout/Header";
import { AdvertsList } from "@/components/advert/AdvertsList";
import { getCategoryById } from "@/lib/constants/categories";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const category = params?.category as string;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const categoryData = getCategoryById(category);

  if (!categoryData) {
    notFound();
  }

  const limit = 20;
  const offset = 0; // Will be handled by AdvertsList with pagination

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{categoryData.name}</h1>
          <p className="text-muted-foreground">
            Browse all ads in {categoryData.name.toLowerCase()}
          </p>
        </div>
        <AdvertsList category={category} limit={limit} offset={offset} />
      </main>
    </>
  );
}
