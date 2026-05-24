import type { Metadata } from "next";
import "@/src/styles/globals.css";
import { Sidebar } from "@/src/components/Sidebar/Sidebar";

export const metadata: Metadata = {
  title: "MedManager",
  description: "Hospital Suite Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 'var(--sidebar-width)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
