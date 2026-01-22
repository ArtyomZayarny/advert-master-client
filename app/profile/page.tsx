import { Header } from "@/components/layout/Header";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="container py-8">
        <ProfileContent />
      </main>
    </>
  );
}
