import { FaHeartbeat } from "react-icons/fa";
import "@/src/styles/components/Sidebar/sidebar-header.css";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="sidebar-header">
      <div className="brand">
        <div className="icon-container">
          <FaHeartbeat size={20} />
        </div>
        {!isCollapsed && (
          <div className="text-container">
            <span className="title">MedManager</span>
            <span className="subtitle">Hospital Suite</span>
          </div>
        )}
      </div>
    </div>
  );
}
