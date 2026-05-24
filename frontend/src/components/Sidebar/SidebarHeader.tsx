import { FaHeartbeat } from "react-icons/fa";
import "@/src/styles/components/Sidebar/sidebar-header.css";

export function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <div className="brand">
        <div className="icon-container">
          <FaHeartbeat size={20} />
        </div>
        <div className="text-container">
          <span className="title">MedManager</span>
          <span className="subtitle">Hospital Suite</span>
        </div>
      </div>
    </div>
  );
}
