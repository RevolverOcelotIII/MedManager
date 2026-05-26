"use client";

import { usePathname } from "next/navigation";
import "@/src/styles/globals.css";
import { Sidebar } from "@/src/components/Sidebar/Sidebar";
import { i18n } from "@/src/lib/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (typeof window !== "undefined") {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale === "pt" || savedLocale === "en") {
      i18n.locale = savedLocale;
    }
  }

  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        {!isLoginPage && <Sidebar />}
        <main style={{ 
          flex: 1, 
          marginLeft: isLoginPage ? 0 : 'var(--current-sidebar-width)',
          transition: 'margin-left 300ms ease-in-out'
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}
