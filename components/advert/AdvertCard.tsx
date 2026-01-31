"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useState } from "react";

interface AdvertCardProps {
  ad: {
    id: number;
    title: string;
    price: number;
    currency: string;
    upload: string;
    city?: string;
    address?: string;
    category?: string;
    db_category?: string;
  };
  showFavorite?: boolean;
}

export function AdvertCard({ ad, showFavorite = true }: AdvertCardProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();

  // Ensure category is available, fallback to db_category if needed
  const advertCategory = ad.category || ad.db_category;

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/user/favourites`, { advertId: ad.id });
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      toast.error("Failed to update favorites");
    },
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to add favorites");
      return;
    }
    favoriteMutation.mutate();
  };

  // Check category after hooks
  if (!advertCategory) {
    console.warn('AdvertCard: Missing category for ad', ad.id);
    return null; // Don't render if category is missing
  }

  return (
    <Link href={`/listings/${advertCategory}/${ad.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]">
        <div className="relative aspect-square">
          <Image
            src={ad.upload || "/placeholder.jpg"}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-destructive text-destructive" : ""
                }`}
              />
            </Button>
          )}
        </div>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>
    </Link>
  );
}
