import { NavLink } from "react-router-dom";

interface NavigationItemProps {

    to: string;
    label: string;
    Icon: any;
    onClick?: () => void;
}

const NavigationItem = ({ to, label, Icon, onClick }: NavigationItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center px-2 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-(--color-secundario) text-(--boton-hover)"
            : "text-(--color-primario) hover:text-(--boton-hover)"
        }`
      }
    >
      <Icon className="mr-3 h-5 w-5 text-(--color-primario) group-hover:text-(--boton-hover)" />
      {label}
    </NavLink>
  );
};

export default NavigationItem;