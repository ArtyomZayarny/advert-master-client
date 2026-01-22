"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";

export function UserAdverts() {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-adverts", userId],
    queryFn: async () => {
      const response = await apiClient.get("/my_ads");
      return response.data;
    },
    enabled: !!userId,
  });

  const deleteAd = async (category: string, advertId: number) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      await apiClient.post(`/${category}/delete/ad`, { advertId });
      toast.success("Ad deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete ad");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">My Ads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">My Ads</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven&apos;t posted any ads yet</p>
            <Link href="/add-advert">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Ad
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group ads by category
  const adsByCategory = Object.entries(data).reduce((acc, [category, adverts]: [string, any]) => {
    if (Array.isArray(adverts) && adverts.length > 0) {
      acc[category] = adverts;
    }
    return acc;
  }, {} as Record<string, any[]>);

  if (Object.keys(adsByCategory).length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">My Ads</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No ads found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Ads</h2>
        <div className="space-y-6">
          {Object.entries(adsByCategory).map(([category, adverts]) => (
            <div key={category}>
              <h3 className="text-lg font-medium mb-3 capitalize">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adverts.map((ad: any) => (
                  <Card key={ad.id} className="overflow-hidden group">
                    <Link href={`/adverts/${category}/${ad.id}`}>
                      <div className="relative aspect-square">
                        <Image
                          src={ad.upload || "/placeholder.jpg"}
                          alt={ad.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link href={`/adverts/${category}/${ad.id}`}>
                        <h3 className="font-semibold line-clamp-2 mb-2">{ad.title}</h3>
                        <p className="text-lg font-bold mb-2">
                          {ad.currency} {ad.price?.toLocaleString()}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">{ad.city || ad.address}</span>
                        </div>
                      </Link>
                      <div className="flex space-x-2">
                        <Link
                          href={`/adverts/${category}/${ad.id}/edit`}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => deleteAd(category, ad.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
