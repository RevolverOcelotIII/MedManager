"use client";

import { usePathname } from "next/navigation";
import { MdDashboard, MdPeople, MdTimeline, MdAccountCircle } from "react-icons/md";
import { FaStethoscope, FaPills } from "react-icons/fa";
import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { SidebarItem } from "@/src/components/Sidebar/SidebarItem";
import "@/src/styles/components/Sidebar/sidebar-nav.css";

const workspaceItems = [
  { href: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/patients", label: "Patients", icon: MdPeople },
  { href: "/attendances", label: "Attendances", icon: BsFillFileEarmarkMedicalFill },
  { href: "/medications", label: "Medicines", icon: FaPills },
];

const administrationItems = [
  { href: "/employees", label: "Employees", icon: FaStethoscope },
  { href: "/roles", label: "Roles", icon: FaUserDoctor },
  { href: "/procedures", label: "Procedures", icon: MdTimeline },
  { href: "/users", label: "Users", icon: MdAccountCircle },
];

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const currentPathname = usePathname();

  return (
    <div className="sidebar-nav-container">
      <div className="nav-section">
        {!isCollapsed && <div className="label">Workspace</div>}
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

      <div className="nav-section">
        {!isCollapsed && <div className="label">Administration</div>}
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
    </div>
  );
}
