"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/src/components/Sidebar/Sidebar";
import { i18n } from "@/src/lib/i18n";
import { AuthGuard } from "@/src/components/layout/AuthGuard";
import { useEffect } from "react";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale === "pt" || savedLocale === "en") {
      i18n.locale = savedLocale;
    }
  }, []);

  return (
    <body style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthGuard>
        {!isLoginPage && <Sidebar />}
        <main style={{ 
          flex: 1, 
          marginLeft: isLoginPage ? 0 : 'var(--current-sidebar-width)',
          transition: 'margin-left 300ms ease-in-out'
        }}>
          {children}
        </main>
      </AuthGuard>
    </body>
  );
}
