"use client";

import { usePathname } from "next/navigation";
import { MdDashboard, MdPeople, MdTimeline, MdAccountCircle } from "react-icons/md";
import { FaStethoscope, FaPills } from "react-icons/fa";
import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { SidebarItem } from "@/src/components/Sidebar/SidebarItem";
import { useAuth } from "@/src/hooks/useAuth";
import { AccessLevel } from "@/src/types/role";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/components/Sidebar/sidebar-nav.css";

const workspaceItems = [
  { href: "/dashboard", label: i18n.t("sidebar.dashboard"), icon: MdDashboard },
  { href: "/patients", label: i18n.t("sidebar.patients"), icon: MdPeople },
  { href: "/attendances", label: i18n.t("sidebar.attendances"), icon: BsFillFileEarmarkMedicalFill },
  { href: "/medications", label: i18n.t("sidebar.medicines"), icon: FaPills },
];

const administrationItems = [
  { href: "/employees", label: i18n.t("sidebar.employees"), icon: FaStethoscope },
  { href: "/roles", label: i18n.t("sidebar.roles"), icon: FaUserDoctor },
  { href: "/procedures", label: i18n.t("sidebar.procedures"), icon: MdTimeline },
  { href: "/users", label: i18n.t("sidebar.users"), icon: MdAccountCircle },
];

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const currentPathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.employee?.role?.access_level === AccessLevel.admin;

  return (
    <div className="sidebar-nav-container">
      <div className="nav-section">
        {!isCollapsed && <div className="label">{i18n.t("sidebar.workspace")}</div>}
        <nav className="nav">
          {workspaceItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              isActive={currentPathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {isAdmin && (
        <div className="nav-section" style={{ marginTop: '1.5rem' }}>
          {!isCollapsed && <div className="label">{i18n.t("sidebar.administration")}</div>}
          <nav className="nav">
            {administrationItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                Icon={item.icon}
                isActive={currentPathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
