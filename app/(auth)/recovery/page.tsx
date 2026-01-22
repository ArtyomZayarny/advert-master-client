import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { Header } from "@/components/layout/Header";

export default function RecoveryPage() {
  return (
    <>
      <Header />
      <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>
          <RecoveryForm />
        </div>
      </main>
    </>
  );
}
