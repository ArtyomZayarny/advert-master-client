"use client";

import { useState } from "react";
import { Advert } from "@/lib/api/adverts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, User, Phone, MessageCircle, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "./ImageGallery";
import { Map } from "@/components/map/Map";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveApi } from "@/lib/api/archive";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface AdvertDetailProps {
  advert: Advert;
  category: string;
}

export function AdvertDetail({ advert, category }: AdvertDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const isOwner = userId === advert.owner;
  const queryClient = useQueryClient();

  const archiveMutation = useMutation({
    mutationFn: () => archiveApi.archiveAd(advert.id),
    onSuccess: () => {
      toast.success("Ad archived successfully");
      queryClient.invalidateQueries({ queryKey: ["user-adverts"] });
      setShowArchiveDialog(false);
    },
    onError: () => {
      toast.error("Failed to archive ad");
    },
  });

  const images = advert.full_upload
    ? [advert.upload, ...advert.full_upload.map((img) => img.uploads)].filter(Boolean)
    : [advert.upload].filter(Boolean);

  // Parse geocode for map
  const getMapCenter = () => {
    if (advert.geocode) {
      const [lat, lng] = advert.geocode.split(" ").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    // Default to Cyprus center
    return { lat: 35.1264, lng: 33.4299 };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Images Section */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4">
            <ImageGallery images={images} title={advert.title} />
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {advert.description}
            </p>
          </CardContent>
        </Card>

        {/* Map */}
        {advert.geocode && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Map center={getMapCenter()} height="400px" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Price and Actions */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-3xl font-bold mb-2">
                {advert.currency} {advert.price?.toLocaleString()}
              </p>
              <h1 className="text-2xl font-semibold mb-4">{advert.title}</h1>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    isFavorite ? "fill-destructive text-destructive" : ""
                  }`}
                />
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </Button>
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowArchiveDialog(true)}
                    disabled={archiveMutation.isPending}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <ConfirmDialog
                    open={showArchiveDialog}
                    onOpenChange={setShowArchiveDialog}
                    title="Archive Ad"
                    description="Archive this ad? It will be hidden from public view but can be restored later."
                    confirmText="Archive"
                    onConfirm={() => archiveMutation.mutate()}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{advert.address}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{advert.city}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {new Date(advert.created_at).toLocaleDateString()}
              </span>
            </div>
            {advert.brand && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{advert.brand}</span>
              </div>
            )}
            {advert.model && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">{advert.model}</span>
              </div>
            )}
            {advert.year && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Year:</span>
                <span className="font-medium">{advert.year}</span>
              </div>
            )}
            {advert.square && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Square:</span>
                <span className="font-medium">{advert.square} m²</span>
              </div>
            )}
            {advert.rooms && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rooms:</span>
                <span className="font-medium">{advert.rooms}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardHeader>
            <CardTitle>Seller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Seller</p>
                <p className="text-sm text-muted-foreground">Member since 2024</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Show Phone
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
