"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { setUser, setToken } from "@/lib/store/slices/authSlice";
import { authApi } from "@/lib/api/auth";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { MapProvider } from "@/lib/contexts/MapContext";
import { useState, useEffect } from "react";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        store.dispatch(setToken(token));
        try {
          const user = await authApi.getCurrentUser();
          store.dispatch(setUser(user));
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MapProvider>
            <AuthInitializer>
              {children}
            </AuthInitializer>
            <Toaster position="top-center" />
          </MapProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}
