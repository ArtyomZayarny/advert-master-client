import { Header } from "@/components/layout/Header";
import { FavoritesList } from "@/components/favorites/FavoritesList";

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            All your saved ads in one place
          </p>
        </div>
        <FavoritesList />
      </main>
    </>
  );
}
