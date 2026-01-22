"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const recoverySchema = z.object({
  email: z.string().email("Invalid email address"),
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

export function RecoveryForm() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
  });

  const recoveryMutation = useMutation({
    mutationFn: (email: string) => authApi.resetPassword(email),
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Password reset link sent to your email");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "Failed to send reset link. Please try again."
      );
    },
  });

  const onSubmit = async (data: RecoveryFormData) => {
    await recoveryMutation.mutateAsync(data.email);
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Check your email</h2>
          <p className="text-muted-foreground">
            We've sent a password reset link to <strong>{getValues("email")}</strong>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={recoveryMutation.isPending}>
        {recoveryMutation.isPending ? "Sending..." : "Send reset link"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="text-foreground hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
