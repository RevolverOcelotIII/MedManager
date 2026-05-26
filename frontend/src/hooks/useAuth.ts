import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ApiService } from "@/src/services/api";
import { User } from "@/src/types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  }, [router]);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await ApiService.get<User>("/auth/me");
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

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

  return {
    user,
    isLoading,
    logout,
    refreshUser: fetchUser
  };
}
