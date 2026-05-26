import { MdLogout } from "react-icons/md";
import { UserProfile } from "@/src/types/components/Sidebar";
import "@/src/styles/components/Sidebar/sidebar-footer.css";

const currentUser: UserProfile = {
  name: "Dr Elena",
  email: "dr.elena@hospital.org",
};

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  return (
    <div className="sidebar-footer">
      <div className="user-container">
        {!isCollapsed && (
          <div className="user-info">
            <p className="user-name">
              {currentUser.name}
            </p>
            <p className="user-email">
              {currentUser.email}
            </p>
          </div>
        )}
        <button 
          className="logout-button"
          aria-label="Logout"
          title={isCollapsed ? "Logout" : undefined}
        >
          <MdLogout size={16} />
        </button>
      </div>
    </div>
  );
}
