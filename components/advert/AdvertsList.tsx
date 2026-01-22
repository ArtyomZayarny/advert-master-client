"use client";

import { useQuery } from "@tanstack/react-query";
import { advertsApi } from "@/lib/api/adverts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/store/hooks";
import { AdvertFilters } from "./AdvertFilters";
import { Pagination } from "@/components/common/Pagination";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdvertCard } from "./AdvertCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Package } from "lucide-react";

interface AdvertsListProps {
  category: string;
  limit: number;
  offset: number;
}

export function AdvertsList({ category, limit, offset }: AdvertsListProps) {
  const filters = useAppSelector((state) => state.advert.filters);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ["adverts", category, limit, offset, appliedFilters],
    queryFn: async () => {
      const params: any = { limit, offset };
      if (appliedFilters.city) params.city = appliedFilters.city;
      if (appliedFilters.priceMin) params.price_min = appliedFilters.priceMin;
      if (appliedFilters.priceMax) params.price_max = appliedFilters.priceMax;
      // Map frontend sort values to backend format
      if (appliedFilters.sortBy) {
        if (appliedFilters.sortBy === 'price_asc') {
          params.sort = 'cheap';
        } else if (appliedFilters.sortBy === 'price_desc') {
          params.sort = 'expensive';
        } else if (appliedFilters.sortBy === 'date') {
          // date sorting is default (by vip, top, lifts), no need to send
        } else {
          params.sort = appliedFilters.sortBy;
        }
      }
      const response = await advertsApi.getByCategory(category, params);
      // API returns { results: [], overall_total: number }
      // Extract results array and total count
      if (response && typeof response === 'object' && 'results' in response) {
        return {
          results: Array.isArray(response.results) ? response.results : [],
          total: response.overall_total || 0,
        };
      }
      // Fallback if response is already an array (backward compatibility)
      return {
        results: Array.isArray(response) ? response : [],
        total: Array.isArray(response) ? response.length : 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load ads. Please try again later.</p>
      </div>
    );
  }

  const ads = data?.results || [];
  const total = data?.total || 0;

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No ads found in this category.</p>
        <p className="text-muted-foreground mt-2">
          Be the first to post an ad in this category!
        </p>
      </div>
    );
  }

  return (
    <>
      <AdvertFilters onApplyFilters={setAppliedFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ads.map((ad: any) => (
          <AdvertCard 
            key={ad.id} 
            ad={{ 
              ...ad, 
              category: ad.db_category || category,
            }} 
          />
        ))}
      </div>
      {total > limit && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / limit)}
          basePath={`/listings/${category}`}
        />
      )}
    </>
  );
}
