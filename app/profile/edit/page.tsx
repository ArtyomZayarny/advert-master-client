import { Header } from "@/components/layout/Header";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

export default function EditProfilePage() {
  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your personal information
          </p>
        </div>
        <EditProfileForm />
      </main>
    </>
  );
}
