import { HeaderProps } from "@/src/types";
import "@/src/styles/components/layout/header.css";

export function Header({ breadcrumb = "Hospital Suite" }: HeaderProps) {
  return (
    <header className="layout-header">
      <span className="breadcrumb">{breadcrumb}</span>
    </header>
  );
}
