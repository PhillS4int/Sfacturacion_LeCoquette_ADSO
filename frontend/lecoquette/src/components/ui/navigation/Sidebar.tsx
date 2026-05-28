import { useEffect, useState } from "react";
import NavigationItem from "./NavigationItem";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  UserCog,
} from "lucide-react";

import logo from "../../../assets/Le-Coquette-logo.svg";
import UserProfile from "../../../pages/Billing/UserProfile/Index";
import { getCurrentUser, type CurrentUser } from "../../../services/user.service";

function getStoredToken(): string | null {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
}

const baseNavigation = [
  { label: "Panel principal", to: "/dashboard", icon: LayoutDashboard },
  { label: "Facturas", to: "/invoices", icon: FileText },
  { label: "Clientes", to: "/customers", icon: Users },
  { label: "Análisis e informes", to: "/analytics", icon: BarChart3 },
  { label: "Ajustes", to: "/settings", icon: SettingsIcon },
];

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const token = getStoredToken();

        if (!token) {
          return;
        }

        const user = await getCurrentUser(token);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error cargando usuario en Sidebar:", error);
      }
    }

    loadCurrentUser();
  }, []);

  const roleName = currentUser?.role?.name?.toLowerCase() || "";
  const isAdmin = roleName === "administrador";

  const navigation = isAdmin
    ? [
        ...baseNavigation,
        { label: "Usuarios", to: "/users", icon: UserCog },
      ]
    : baseNavigation;

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-1 border-r border-(--color-primario) bg-(--color-fondo)">
        <div className="flex items-center px-4 pt-5">
          <img src={logo} alt="Logo" />
        </div>

        <nav className="mt-8 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <NavigationItem
              key={item.label}
              to={item.to}
              label={item.label}
              Icon={item.icon}
            />
          ))}
        </nav>

        <div className="border-t border-(--color-primario) p-3">
          <UserProfile />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;