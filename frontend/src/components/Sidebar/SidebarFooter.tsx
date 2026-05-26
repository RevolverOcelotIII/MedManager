"use client";

import { MdLogout } from "react-icons/md";
import { useAuth } from "@/src/hooks/useAuth";
import { LanguageSwitcher } from "@/src/components/layout/LanguageSwitcher";
import "@/src/styles/components/Sidebar/sidebar-footer.css";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="sidebar-footer">
        <div className="user-container">
          {!isCollapsed && <div className="user-info">Loading...</div>}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="sidebar-footer">
      <LanguageSwitcher isCollapsed={isCollapsed} />
      <div className="user-container">
        {!isCollapsed && (
          <div className="user-info">
            <p className="user-name">
              {user.employee?.full_name || "User"}
            </p>
            <p className="user-email">
              {user.email}
            </p>
          </div>
        )}
        <button 
          className="logout-button"
          aria-label="Logout"
          title={isCollapsed ? "Logout" : undefined}
          onClick={logout}
        >
          <MdLogout size={16} />
        </button>
      </div>
    </div>
  );
}
