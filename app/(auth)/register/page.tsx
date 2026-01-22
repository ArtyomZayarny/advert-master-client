import { RegisterForm } from "@/components/auth/RegisterForm";
import { Header } from "@/components/layout/Header";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">
              Sign up to start posting ads
            </p>
          </div>
          <RegisterForm />
        </div>
      </main>
    </>
  );
}
