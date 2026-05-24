"use client";

import { useRouter } from "next/navigation";
import { LoginSidebar } from "@/src/app/login/LoginSidebar";
import { LoginForm } from "@/src/app/login/LoginForm";
import { LoginFormData } from "@/src/types/app/login/LoginPage";
import "@/src/styles/app/login.css";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (data: LoginFormData) => {
    console.log("Login attempt:", data);
    router.push("/patients");
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
