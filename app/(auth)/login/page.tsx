import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
