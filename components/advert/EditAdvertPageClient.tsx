"use client";

import { useQuery } from "@tanstack/react-query";
import { advertsApi } from "@/lib/api/adverts";
import { EditAdvertForm } from "./EditAdvertForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditAdvertPageClientProps {
  category: string;
  advertId: number;
}

export function EditAdvertPageClient({ category, advertId }: EditAdvertPageClientProps) {
  const { data: advert, isLoading, error } = useQuery({
    queryKey: ["advert", category, advertId],
    queryFn: () => advertsApi.getById(category, advertId),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (error || !advert) {
    notFound();
  }

  return <EditAdvertForm advert={advert} category={category} />;
}
