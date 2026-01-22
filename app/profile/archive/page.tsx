import { Header } from "@/components/layout/Header";
import { ArchiveList } from "@/components/archive/ArchiveList";

export default function ArchivePage() {
  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Archive</h1>
          <p className="text-muted-foreground">
            Your archived ads are hidden from public view
          </p>
        </div>
        <ArchiveList />
      </main>
    </>
  );
}
