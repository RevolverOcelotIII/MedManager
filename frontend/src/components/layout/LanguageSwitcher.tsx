"use client";

import { useState, useEffect } from "react";
import { i18n } from "@/src/lib/i18n";
import { MdLanguage } from "react-icons/md";
import "@/src/styles/components/layout/language-switcher.css";

export function LanguageSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  const toggleLanguage = () => {
    const nextLocale = i18n.locale === "pt" ? "en" : "pt";
    i18n.locale = nextLocale;
    localStorage.setItem("locale", nextLocale);
    setCurrentLocale(nextLocale);
    // Simple way to force re-render across the app
    window.location.reload();
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && (savedLocale === "pt" || savedLocale === "en")) {
      i18n.locale = savedLocale;
      setCurrentLocale(savedLocale);
    }
  }, []);

  return (
    <button 
      className="language-switcher-button" 
      onClick={toggleLanguage}
      title={currentLocale === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <MdLanguage size={18} />
      {!isCollapsed && (
        <span className="language-label">
          {currentLocale === "pt" ? "Português" : "English"}
        </span>
      )}
    </button>
  );
}
