import { SidebarHeader } from "@/src/components/Sidebar/SidebarHeader";
import { SidebarNav } from "@/src/components/Sidebar/SidebarNav";
import { SidebarFooter } from "@/src/components/Sidebar/SidebarFooter";
import "@/src/styles/components/Sidebar/sidebar.css";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}
