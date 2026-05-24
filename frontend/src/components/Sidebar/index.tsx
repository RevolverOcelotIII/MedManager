import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";
import "@/styles/components/Sidebar/sidebar.css";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}
