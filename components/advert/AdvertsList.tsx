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
    queryFn: () => {
      const params: any = { limit, offset };
      if (appliedFilters.city) params.city = appliedFilters.city;
      if (appliedFilters.priceMin) params.price_min = appliedFilters.priceMin;
      if (appliedFilters.priceMax) params.price_max = appliedFilters.priceMax;
      if (appliedFilters.sortBy) params.sort = appliedFilters.sortBy;
      return advertsApi.getByCategory(category, params);
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

  if (!data || data.length === 0) {
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
        {data.map((ad: any) => (
          <AdvertCard key={ad.id} ad={{ ...ad, category }} />
        ))}
      </div>
      {data && data.length >= limit && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((data.length || 0) / limit)}
          basePath={`/adverts/${category}`}
        />
      )}
    </>
  );
}
