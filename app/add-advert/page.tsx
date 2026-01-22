import { Header } from "@/components/layout/Header";
import { AddAdvertForm } from "@/components/advert/AddAdvertForm";

export default function AddAdvertPage() {
  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post New Ad</h1>
          <p className="text-muted-foreground">
            Create a new listing to reach thousands of potential buyers
          </p>
        </div>
        <AddAdvertForm />
      </main>
    </>
  );
}
