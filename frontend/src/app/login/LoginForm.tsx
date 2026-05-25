"use client";

import { FaHeartbeat } from "react-icons/fa";
import { LoginFormProps } from "@/src/types/app/login/LoginPage";

export function LoginForm({ onSubmit }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      username: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <div className="login-card">
      <div className="mobile-brand">
        <div className="mobile-brand-icon">
          <FaHeartbeat size={20} />
        </div>
        <h1 className="mobile-brand-name">MedManager</h1>
      </div>

      <h1 className="welcome-title">Welcome back</h1>
      <p className="welcome-subtitle">Sign in with your hospital credentials.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input 
            className="form-input" 
            id="email" 
            name="email"
            required
            type="email" 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input 
            className="form-input" 
            id="password" 
            name="password"
            required 
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button className="submit-button" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
