import { Header } from "@/components/layout/Header";
import { AdvertDetail } from "@/components/advert/AdvertDetail";
import { advertsApi } from "@/lib/api/adverts";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function AdvertDetailPage({ params }: PageProps) {
  const { category, id } = await params;
  const advertId = Number(id);

  if (isNaN(advertId)) {
    notFound();
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/${category}/${advertId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      notFound();
    }

    const advert = await response.json();
    
    return (
      <>
        <Header />
        <main className="container py-8">
          <AdvertDetail advert={advert} category={category} />
        </main>
      </>
    );
  } catch (error) {
    notFound();
  }
}
