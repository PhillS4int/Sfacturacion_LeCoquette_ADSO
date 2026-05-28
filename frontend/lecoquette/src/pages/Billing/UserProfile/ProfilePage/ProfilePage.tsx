import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../components/UserAvatar';
import { getCurrentUser, type CurrentUser } from '../../../../services/user.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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

function formatDate(dateValue?: string | null): string {
  if (!dateValue) {
    return 'No disponible';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'No disponible';
  }

  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getDepartmentByRole(roleName?: string | null): string {
  const normalizedRole = (roleName || '').toLowerCase();

  if (normalizedRole === 'administrador') {
    return 'Administración y Finanzas';
  }

  if (normalizedRole === 'empleado') {
    return 'Operación y Facturación';
  }

  return 'Área administrativa';
}

function getDescriptionByRole(roleName?: string | null): string {
  const normalizedRole = (roleName || '').toLowerCase();

  if (normalizedRole === 'administrador') {
    return 'Administrador del sistema de facturación. Responsable de la gestión de usuarios, clientes, facturas, reportes y configuración general.';
  }

  if (normalizedRole === 'empleado') {
    return 'Usuario operativo del sistema de facturación. Puede gestionar clientes y facturas según los permisos asignados.';
  }

  return 'Usuario del sistema LeCoquette.';
}

const roleColors: Record<string, string> = {
  administrador: 'bg-(--color-fondo) text-(--color-primario)',
  Administrador: 'bg-(--color-fondo) text-(--color-primario)',
  empleado: 'bg-(--color-fondo) text-white',
  Empleado: 'bg-(--color-fondo) text-white',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const token = getStoredToken();

        if (!token) {
          setErrorMessage('No se encontró una sesión activa.');
          return;
        }

        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setErrorMessage('No se pudo cargar la información del perfil.');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const roleName = user?.role?.name || 'Usuario';
  const roleLabel = formatRole(roleName);
  const roleColor = roleColors[roleName] ?? 'bg-gray-100 text-gray-700 border-gray-200';

  const userName = user?.full_name || 'Usuario';
  const userEmail = user?.email || 'No disponible';
  const userPhone = user?.phone || 'No disponible';
  const department = getDepartmentByRole(roleName);
  const location = 'Bogotá, Colombia';
  const joinDate = formatDate(user?.created_at);
  const description = getDescriptionByRole(roleName);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900">Mi Perfil</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Cargando perfil...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && user && (
          <>
            {/* Avatar & identity card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-28 bg-linear-to-r from-blue-600 to-indigo-500" />

              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4 w-fit">
                  <UserAvatar name={userName} avatarUrl={null} size="xl" />

                  <button
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                    aria-label="Cambiar foto"
                    type="button"
                  >
                    <Camera className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{department}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${roleColor}`}
                  >
                    <Shield className="w-3 h-3" />
                    {roleLabel}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">
                    Descripción
                  </p>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Información de contacto
              </h3>

              <InfoRow icon={Mail} label="Correo electrónico" value={userEmail} />
              <InfoRow icon={Phone} label="Teléfono" value={userPhone} />
              <InfoRow icon={MapPin} label="Ubicación" value={location} />
            </div>

            {/* Información organizacional */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Información organizacional
              </h3>

              <InfoRow icon={Building2} label="Departamento" value={department} />
              <InfoRow icon={Shield} label="Rol" value={roleLabel} />
              <InfoRow icon={Calendar} label="Miembro desde" value={joinDate} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;