import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { UserAvatar } from './components/UserAvatar';
import { UserDropdownMenu } from './components/UserDropdownMenu';
import { getCurrentUser, type CurrentUser } from '../../../services/user.service';

const roleColors: Record<string, string> = {
  administrador: 'text-(--color-primario)',
  Administrador: 'text-(--color-primario)',
  empleado: 'text-white',
  Empleado: 'text-white',
};

interface UserProfileProps {
  isMobile?: boolean;
}

function getStoredToken(): string | null {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken')
  );
}

function formatRole(roleName?: string | null): string {
  if (!roleName) {
    return 'Usuario';
  }

  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
}

export function UserProfile({ isMobile = false }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const token = getStoredToken();

        if (!token) {
          return;
        }

        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (error) {
        console.error('Error cargando el perfil del usuario:', error);
      }
    }

    loadCurrentUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userName = user?.full_name || 'Usuario';
  const userEmail = user?.email || '';
  const userRoleName = user?.role?.name || 'Usuario';
  const userRole = formatRole(userRoleName);
  const roleColor = roleColors[userRoleName] ?? 'text-(--color-primario)';

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:text-(--boton-hover) ${
          isOpen ? 'bg-(--color-secundario)' : ''
        }`}
      >
        <UserAvatar name={userName} avatarUrl={null} size="md" />

        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-(--color-primario) truncate">
            {userName}
          </p>

          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 ${roleColor}`}>
            {userRole}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-(--color-primario) transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <UserDropdownMenu
          name={userName}
          email={userEmail}
          role={userRoleName}
          isMobile={isMobile}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;