import { Metadata } from "next";
import "@/src/styles/globals.css";
import { LayoutClient } from "./LayoutClient";

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
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='%23ef4444' d='M320.2 161.9c-1.1-2.5-3.6-4.1-6.3-4.1s-5.2 1.6-6.3 4.1L248.8 300.2L201 216c-1.1-2.5-3.6-4.1-6.3-4.1s-5.2 1.6-6.3 4.1L143.6 304H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h128c2.7 0 5.2-1.6 6.3-4.1L201 289.8l47.8 84.2c1.1 2.5 3.6 4.1 6.3 4.1s5.2-1.6 6.3-4.1l68.8-158.3l22.9 51.3c1.1 2.5 3.6 4.1 6.3 4.1h120.7c17.7 0 32-14.3 32-32s-14.3-32-32-32H361.8l-41.6-93.1z'/></svg>" />
      </head>
      <LayoutClient>
        {children}
      </LayoutClient>
    </html>
  );
}
