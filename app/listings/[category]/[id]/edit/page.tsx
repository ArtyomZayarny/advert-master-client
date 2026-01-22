import { Header } from "@/components/layout/Header";
import { EditAdvertPageClient } from "@/components/advert/EditAdvertPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function EditAdvertPage({ params }: PageProps) {
  const { category, id } = await params;
  const advertId = Number(id);

  if (isNaN(advertId)) {
    notFound();
  }
    
  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Ad</h1>
          <p className="text-muted-foreground">
            Update your listing information
          </p>
        </div>
        <EditAdvertPageClient category={category} advertId={advertId} />
      </main>
    </>
  );
}
