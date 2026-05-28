"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/src/store/useAuthStore";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, fetchUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      const token = Cookies.get("token");
      if (!token && user) {
        logout();
      }
    }, 5000);

    return () => clearInterval(checkTokenInterval);
  }, [user, logout]);

  useEffect(() => {
    if (!isLoading) {
      const token = Cookies.get("token");
      if (!token && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router, pathname]);

  return <>{children}</>;
}
