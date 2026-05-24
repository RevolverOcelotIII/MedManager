"use client";
import { useRouter } from "next/navigation";
import { LoginSidebar } from "@/src/app/login/LoginSidebar";
import { LoginForm } from "@/src/app/login/LoginForm";
import { LoginFormData } from "@/src/types/app/login/LoginPage";
import { ApiService } from "@/src/services/api";
import "@/src/styles/app/login.css";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    try {
      console.log("Login attempt:", data);
      const response = await ApiService.post("/auth/login", data, true);
      console.log("Login success:", response);
      // Success redirect
      router.push("/patients");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
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
