"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AdvertCard } from "./AdvertCard";

export function FeaturedAds() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-ads"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/new`
      );
      if (!response.ok) return [];
      const categoriesData = await response.json();
      
      // API returns an object with categories, convert to flat array
      if (categoriesData && typeof categoriesData === 'object' && !Array.isArray(categoriesData)) {
        const allAds: any[] = [];
        Object.values(categoriesData).forEach((categoryAds: any) => {
          if (Array.isArray(categoryAds)) {
            allAds.push(...categoryAds);
          }
        });
        // Sort by created_at (newest first)
        return allAds.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
      }
      
      // If it's already an array, return as is
      return Array.isArray(categoriesData) ? categoriesData : [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No featured ads available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.slice(0, 8).map((ad: any) => (
        <AdvertCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
