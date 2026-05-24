import { IconType } from "react-icons";

export interface SidebarItemProps {
  href: string;
  label: string;
  Icon: IconType;
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
}
