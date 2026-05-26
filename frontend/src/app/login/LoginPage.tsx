"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { LoginSidebar } from "@/src/app/login/LoginSidebar";
import { LoginForm } from "@/src/app/login/LoginForm";
import { LoginFormData } from "@/src/types/app/login/LoginPage";
import { ApiService } from "@/src/services/api";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/app/login.css";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await ApiService.post<{ access_token: string; token_type: string }>(
        "/auth/login", 
        data, 
        true
      );

      Cookies.set("token", response.access_token, {
        expires: 1 / 48, // 30 minutes
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      router.push("/patients");
    } catch (error) {
      console.error("Login failed:", error);
      alert(i18n.t("login.login_failed"));
    }
  };

  return (
    <div className="login-layout">
      <LoginSidebar />
      <main className="login-main">
        <LoginForm onSubmit={handleLogin} />
      </main>
    </div>
  );
}
