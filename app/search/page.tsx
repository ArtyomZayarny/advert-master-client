import { Header } from "@/components/layout/Header";
import { SearchResults } from "@/components/search/SearchResults";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : undefined;
  const city = typeof params.city === "string" ? params.city : undefined;

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              Results for: <strong>{query}</strong>
            </p>
          )}
        </div>
        <SearchResults query={query} category={category} city={city} />
      </main>
    </>
  );
}
