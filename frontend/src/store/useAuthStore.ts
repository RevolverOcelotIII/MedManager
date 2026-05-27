import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/src/types/user";
import { ApiService } from "@/src/services/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchUser: async () => {
    const token = Cookies.get("token");
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const userData = await ApiService.get<User>("/auth/me");
      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    Cookies.remove("token");
    set({ user: null, isLoading: false });
  },
  clearUser: () => set({ user: null, isLoading: false }),
}));
