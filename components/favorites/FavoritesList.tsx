"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";

export function FavoritesList() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.user?.id);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return {};
      const response = await apiClient.get("/user/favourites/all", {
        params: { user: userId },
      });
      return response.data;
    },
    enabled: isAuthenticated && !!userId,
  });

  const removeFavorite = async (advertId: number) => {
    try {
      await apiClient.delete(`/user/favourites`, { data: { advertId } });
      toast.success("Removed from favorites");
      refetch();
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">
          Please sign in to view your favorites
        </p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

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

  if (!data || Object.keys(data).length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No favorites yet"
        description="Start saving ads you like to see them here"
        action={{
          label: "Browse Ads",
          href: "/",
        }}
      />
    );
  }

  // Flatten all favorites into a single array
  const allFavorites: any[] = [];
  Object.entries(data).forEach(([category, adverts]: [string, any]) => {
    if (Array.isArray(adverts)) {
      adverts.forEach((ad: any) => {
        if (ad) {
          allFavorites.push({ ...ad, _category: ad.db_category || category });
        }
      });
    }
  });

  if (allFavorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No favorites yet"
        description="Start saving ads you like to see them here"
        action={{
          label: "Browse Ads",
          href: "/",
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {allFavorites.map((ad: any) => (
        <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
          <Link href={`/listings/${ad._category}/${ad.id}`}>
            <div className="relative aspect-square">
              <Image
                src={ad.upload || "/placeholder.jpg"}
                alt={ad.title || "Ad"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  removeFavorite(ad.id);
                }}
              >
                <Heart className="h-4 w-4 fill-destructive text-destructive" />
              </Button>
            </div>
          </Link>
          <CardContent className="p-4">
            <Link href={`/listings/${ad._category}/${ad.id}`}>
              <h3 className="font-semibold line-clamp-2 mb-2 min-h-[3rem]">
                {ad.title}
              </h3>
              <p className="text-lg font-bold mb-2">
                {ad.currency} {ad.price?.toLocaleString()}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{ad.city || ad.address}</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
