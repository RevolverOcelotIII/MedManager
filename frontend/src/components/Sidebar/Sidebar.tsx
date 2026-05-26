"use client";

import { useState, useEffect } from "react";
import { MdMenuOpen, MdMenu } from "react-icons/md";
import { SidebarHeader } from "@/src/components/Sidebar/SidebarHeader";
import { SidebarNav } from "@/src/components/Sidebar/SidebarNav";
import { SidebarFooter } from "@/src/components/Sidebar/SidebarFooter";
import "@/src/styles/components/Sidebar/sidebar.css";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isCollapsed) {
      root.style.setProperty('--current-sidebar-width', 'var(--sidebar-collapsed-width)');
    } else {
      root.style.setProperty('--current-sidebar-width', 'var(--sidebar-width)');
    }
  }, [isCollapsed]);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button 
        className="collapse-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <MdMenu size={20} /> : <MdMenuOpen size={20} />}
      </button>

      <SidebarHeader isCollapsed={isCollapsed} />
      <SidebarNav isCollapsed={isCollapsed} />
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
}
