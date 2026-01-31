"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Edit, Plus, Archive, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAdverts } from "./UserAdverts";
import { toast } from "sonner";

export function ProfileContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
  });

  const handleSignOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with local logout even if API fails
    }
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">
          Please sign in to view your profile
        </p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
                {user.upload_user ? (
                  <Image
                    src={user.upload_user}
                    alt={user.first_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.first_name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                {user.deals && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.deals} deal{user.deals !== 1 ? "s" : ""} completed
                  </p>
                )}
              </div>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/add-advert">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Post New Ad
              </Button>
            </Link>
            <Link href="/profile/archive">
              <Button variant="outline" className="w-full">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Ads */}
      <UserAdverts />
    </div>
  );
}
