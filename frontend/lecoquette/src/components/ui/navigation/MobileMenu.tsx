import NavigationItem from "./NavigationItem";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";

import UserProfile from "../../../pages/Billing/UserProfile/Index"; // ajusta ruta

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { label: "Panel principal", to: "/dashboard", icon: LayoutDashboard },
  { label: "Facturas", to: "/invoices", icon: FileText },
  { label: "Clientes", to: "/customers", icon: Users },
  { label: "Análisis e informes", to: "/analytics", icon: BarChart3 },
  { label: "Ajustes", to: "/settings", icon: SettingsIcon },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <div
        className="fixed inset-0 bg-white bg-opacity-75"
        onClick={onClose}
      />

      <div className="relative flex w-full max-w-xs flex-col bg-(--color-fondo)">
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <NavigationItem
                key={item.label}
                to={item.to}
                label={item.label}
                Icon={item.icon}
                onClick={onClose}
              />
            ))}
          </nav>
        </div>

        <div className="border-t border-(--color-primario) p-3">
          <UserProfile isMobile />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;