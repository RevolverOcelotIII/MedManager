"use client";

import { usePathname } from "next/navigation";
import { MdDashboard, MdPeople, MdTimeline } from "react-icons/md";
import { FaStethoscope, FaPills } from "react-icons/fa";
import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { SidebarItem } from "@/src/components/Sidebar/SidebarItem";
import "@/src/styles/components/Sidebar/sidebar-nav.css";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/patients", label: "Patients", icon: MdPeople },
  { href: "/attendances", label: "Attendances", icon: BsFillFileEarmarkMedicalFill },
  { href: "/employees", label: "Employees", icon: FaStethoscope },
  { href: "/medications", label: "Medicines", icon: FaPills },
  { href: "/procedures", label: "Procedures", icon: MdTimeline },
];

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const currentPathname = usePathname();

  return (
    <div className="sidebar-nav-container">
      {!isCollapsed && <div className="label">Workspace</div>}
      <nav className="nav">
        {navigationItems.map((item) => (
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
  );
}
