import { MdLogout } from "react-icons/md";
import { UserProfile } from "@/src/types/components/Sidebar";
import "@/src/styles/components/Sidebar/sidebar-footer.css";

const currentUser: UserProfile = {
  name: "Dr Elena",
  email: "dr.elena@hospital.org",
};

export function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <div className="user-container">
        <div className="user-info">
          <p className="user-name">
            {currentUser.name}
          </p>
          <p className="user-email">
            {currentUser.email}
          </p>
        </div>
        <button 
          className="logout-button"
          aria-label="Logout"
        >
          <MdLogout size={16} />
        </button>
      </div>
    </div>
  );
}
