import { LogOut, Settings, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserDropdownMenuProps {
  name: string;
  email: string;
  role?: string;
  isMobile?: boolean;
  onClose: () => void;
}

export function UserDropdownMenu({
  name,
  email,
  role,
  isMobile = false,
  onClose,
}: UserDropdownMenuProps) {
  const navigate = useNavigate();

  const normalizedRole = (role || '').toLowerCase();
  const isAdmin = normalizedRole === 'administrador';

  function handleNavigate(path: string) {
    navigate(path);
    onClose();
  }

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');

    navigate('/login');
    onClose();
  }

  return (
    <div
      className={`${
        isMobile ? 'relative' : 'absolute bottom-full left-0 right-0 mb-2'
      } bg-white border border-(--boton-hover) rounded-lg shadow-lg overflow-hidden z-50`}
    >
      <div className="p-3 border-b border-(--color-primario)">
        <p className="text-sm font-medium text-(--color-fondo)">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{email}</p>
      </div>

      <div className="py-1">
        <button
          onClick={() => handleNavigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserCircle className="w-4 h-4" />
          Ver perfil
        </button>

        {isAdmin && (
          <button
            onClick={() => handleNavigate('/account-settings')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Ajustes de la cuenta
          </button>
        )}
      </div>

      <div className="border-t border-(--color-primario) py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Finalizar sesión
        </button>
      </div>
    </div>
  );
}

export default UserDropdownMenu;