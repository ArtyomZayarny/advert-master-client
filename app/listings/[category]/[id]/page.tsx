"use client";

import { Header } from "@/components/layout/Header";
import { AdvertDetail } from "@/components/advert/AdvertDetail";
import { advertsApi } from "@/lib/api/adverts";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function AdvertDetailPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const category = params?.category as string;
  const id = params?.id as string;
  const advertId = Number(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: advert, isLoading, error } = useQuery({
    queryKey: ["advert", category, advertId],
    queryFn: () => advertsApi.getById(category, advertId),
    enabled: mounted && !isNaN(advertId) && !!category,
  });

  if (!mounted) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (isNaN(advertId) || !category) {
    notFound();
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </>
    );
  }

  if (error || !advert) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container py-8">
        <AdvertDetail advert={advert} category={category} />
      </main>
    </>
  );
}
