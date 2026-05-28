"use client";

import { FaHeartbeat } from "react-icons/fa";
import { LoginFormProps } from "@/src/types/app/login/LoginPage";
import { i18n } from "@/src/lib/i18n";
import { LanguageSwitcher } from "@/src/components/layout/LanguageSwitcher";

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
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <LanguageSwitcher isCollapsed={true} />
      </div>

      <div className="mobile-brand">
        <div className="mobile-brand-icon">
          <FaHeartbeat size={20} />
        </div>
        <h1 className="mobile-brand-name">MedManager</h1>
      </div>

      <h1 className="welcome-title">{i18n.t("pages.login.welcome")}</h1>
      <p className="welcome-subtitle">{i18n.t("pages.login.subtitle")}</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">{i18n.t("pages.login.email")}</label>
          <input 
            className="form-input" 
            id="email" 
            name="email"
            required
            type="email" 
            placeholder={i18n.t("pages.login.email_placeholder")}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">{i18n.t("pages.login.password")}</label>
          <input 
            className="form-input" 
            id="password" 
            name="password"
            required 
            type="password"
            placeholder={i18n.t("pages.login.password_placeholder")}
          />
        </div>
        <button className="submit-button" type="submit">
          {i18n.t("pages.login.sign_in")}
        </button>
      </form>
    </div>
  );
}
