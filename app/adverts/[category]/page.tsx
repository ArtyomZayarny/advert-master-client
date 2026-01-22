import { Header } from "@/components/layout/Header";
import { AdvertsList } from "@/components/advert/AdvertsList";
import { getCategoryById } from "@/lib/constants/categories";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const categoryData = getCategoryById(category);

  if (!categoryData) {
    notFound();
  }

  const searchParamsObj = await searchParams;
  const page = Number(searchParamsObj.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{categoryData.name}</h1>
          <p className="text-muted-foreground">
            Browse all ads in {categoryData.name.toLowerCase()}
          </p>
        </div>
        <AdvertsList category={category} limit={limit} offset={offset} />
      </main>
    </>
  );
}
