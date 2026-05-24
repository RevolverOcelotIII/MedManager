import Link from "next/link";
import "@/src/styles/components/Sidebar/sidebar-item.css";
import { SidebarItemProps } from "@/src/types/components/Sidebar";

export function SidebarItem({ href, label, Icon, isActive }: SidebarItemProps) {
  const className = `sidebar-item ${isActive ? 'active' : ''}`;

  return (
    <Link href={href} className={className}>
      <Icon className="icon" />
      <span>{label}</span>
    </Link>
  );
}
