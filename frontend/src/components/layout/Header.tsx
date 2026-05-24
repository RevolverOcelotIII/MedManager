import { MdMenuOpen } from "react-icons/md";
import { HeaderProps } from "@/src/types";
import "@/src/styles/components/layout/header.css";

export function Header({ breadcrumb = "Hospital Suite" }: HeaderProps) {
  return (
    <header className="layout-header">
      <button 
        className="trigger-button"
        aria-label="Toggle Sidebar"
      >
        <MdMenuOpen size={20} />
      </button>
      <div className="divider"></div>
      <span className="breadcrumb">{breadcrumb}</span>
    </header>
  );
}
