"use client";

import { usePathname } from "next/navigation";
import "@/src/styles/globals.css";
import { Sidebar } from "@/src/components/Sidebar/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        {!isLoginPage && <Sidebar />}
        <main style={{ 
          flex: 1, 
          marginLeft: isLoginPage ? 0 : 'var(--sidebar-width)',
          transition: 'margin-left 300ms ease-in-out'
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}
