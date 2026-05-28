import Link from "next/link";
import "@/src/styles/components/Sidebar/sidebar-item.css";
import { SidebarItemProps } from "@/src/types/components/Sidebar";

export function SidebarItem({ href, label, Icon, isActive, isCollapsed }: SidebarItemProps) {
  const className = `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`;

  return (
    <Link href={href} className={className} title={isCollapsed ? label : undefined}>
      <Icon className="icon" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}
