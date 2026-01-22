"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useState } from "react";

export function ArchiveList() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["archive", userId],
    queryFn: async () => {
      const response = await apiClient.get("/archive/");
      return response.data;
    },
    enabled: isAuthenticated && !!userId,
  });

  const restoreMutation = useMutation({
    mutationFn: async (advertId: number) => {
      // Restore by editing the ad (unarchive)
      await apiClient.put(`/archive/${advertId}`, { archived: false });
    },
    onSuccess: () => {
      toast.success("Ad restored successfully");
      queryClient.invalidateQueries({ queryKey: ["archive"] });
      queryClient.invalidateQueries({ queryKey: ["user-adverts"] });
    },
    onError: () => {
      toast.error("Failed to restore ad");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (advertId: number) => {
      await apiClient.delete(`/archive/${advertId}`);
    },
    onSuccess: () => {
      toast.success("Ad deleted permanently");
      queryClient.invalidateQueries({ queryKey: ["archive"] });
    },
    onError: () => {
      toast.error("Failed to delete ad");
    },
  });

  const [restoreDialog, setRestoreDialog] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);

  const handleRestore = (advertId: number) => {
    setRestoreDialog(advertId);
  };

  const handleDelete = (advertId: number) => {
    setDeleteDialog(advertId);
  };

  const confirmRestore = () => {
    if (restoreDialog) {
      restoreMutation.mutate(restoreDialog);
      setRestoreDialog(null);
    }
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      deleteMutation.mutate(deleteDialog);
      setDeleteDialog(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">
          Please sign in to view your archive
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
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Your archive is empty</p>
        <p className="text-muted-foreground mt-2">
          Archived ads will appear here
        </p>
      </div>
    );
  }

  // Group archive by category
  const archiveByCategory = Object.entries(data).reduce((acc, [category, adverts]: [string, any]) => {
    if (Array.isArray(adverts) && adverts.length > 0) {
      acc[category] = adverts;
    }
    return acc;
  }, {} as Record<string, any[]>);

  if (Object.keys(archiveByCategory).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Your archive is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(archiveByCategory).map(([category, adverts]) => (
        <div key={category}>
          <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adverts.map((ad: any) => (
              <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <Link href={`/adverts/${category}/${ad.id}`}>
                  <div className="relative aspect-square">
                    <Image
                      src={ad.upload || "/placeholder.jpg"}
                      alt={ad.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/adverts/${category}/${ad.id}`}>
                    <h3 className="font-semibold line-clamp-2 mb-2 min-h-[3rem]">
                      {ad.title}
                    </h3>
                    <p className="text-lg font-bold mb-2">
                      {ad.currency} {ad.price?.toLocaleString()}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{ad.city || ad.address}</span>
                    </div>
                  </Link>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRestore(ad.id)}
                      disabled={restoreMutation.isPending}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(ad.id)}
                      disabled={deleteMutation.isPending}
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

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={restoreDialog !== null}
        onOpenChange={(open) => !open && setRestoreDialog(null)}
        title="Restore Ad"
        description="Restore this ad? It will be visible to the public again."
        confirmText="Restore"
        onConfirm={confirmRestore}
      />

      <ConfirmDialog
        open={deleteDialog !== null}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Delete Ad Permanently"
        description="Permanently delete this ad? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
