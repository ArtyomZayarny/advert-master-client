"use client";

import { useQuery } from "@tanstack/react-query";
import { advertsApi } from "@/lib/api/adverts";
import { AdvertsList } from "@/components/advert/AdvertsList";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Search } from "lucide-react";
import Image from "next/image";

interface SearchResultsProps {
  query: string;
  category?: string;
  city?: string;
}

export function SearchResults({ query, category, city }: SearchResultsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, category, city],
    queryFn: () => advertsApi.search(query, { category, city }),
    enabled: !!query,
  });

  if (!query) {
    return (
      <EmptyState
        icon={Search}
        title="Start searching"
        description="Enter a search query to find ads"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Search}
        title="Search failed"
        description="Please try again later"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No results found"
        description="Try adjusting your search terms or filters"
      />
    );
  }

  // Use the first category from results or default
  const firstCategory = data[0]?.category || "all";
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Found {data.length} result{data.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((ad: any) => {
          const advertCategory = ad.category || ad.db_category;
          if (!advertCategory) {
            console.warn('SearchResults: Missing category for ad', ad.id);
            return null;
          }
          return (
          <a
            key={ad.id}
            href={`/listings/${advertCategory}/${ad.id}`}
            className="block"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative aspect-square">
                <Image
                  src={ad.upload || "/placeholder.jpg"}
                  alt={ad.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2 min-h-[3rem]">
                  {ad.title}
                </h3>
                <p className="text-lg font-bold mb-2">
                  {ad.currency} {ad.price?.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {ad.city || ad.address}
                </p>
              </div>
            </div>
          </a>
          );
        })}
      </div>
    </div>
  );
}
