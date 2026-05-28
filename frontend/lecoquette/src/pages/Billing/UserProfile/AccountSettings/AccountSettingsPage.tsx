import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAccountSettings } from './hooks/useAccountSettings';

import { SectionTitle } from './components/SectionTitle';
import { ToggleRow } from './components/ToggleRow';
import { SelectRow } from './components/SelectRow';
import { ActionRow } from './components/ActionRow';
import { ChangePasswordModal } from './components/ChangePasswordModal';

import {
  Mail,
  Shield,
  Lock,
  Globe,
  Trash2,
  User,
  Phone,
  Save,
} from 'lucide-react';

import {
  getCurrentUser,
  updateCurrentUserProfile,
  type CurrentUser,
} from '../../../../services/user.service';

function getStoredToken(): string | null {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken')
  );
}

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const {
    notifications,
    security,
    preferences,
    setSecurity,
    setPreferences,
    updateNotif,
  } = useAccountSettings();

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = getStoredToken();

        if (!token) {
          setProfileError('No se encontró el token de sesión.');
          return;
        }

        const user = await getCurrentUser(token);

        setCurrentUser(user);
        setFullName(user.full_name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setProfileError('No se pudo cargar la información del perfil.');
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSaveProfile() {
    try {
      setIsSavingProfile(true);
      setProfileMessage('');
      setProfileError('');

      const token = getStoredToken();

      if (!token) {
        setProfileError('No se encontró el token de sesión.');
        return;
      }

      const payload: {
        full_name?: string;
        email?: string;
        phone?: string;
        password?: string;
      } = {
        full_name: fullName,
        email,
        phone,
      };

      if (password.trim()) {
        payload.password = password;
      }

      const updatedUser = await updateCurrentUserProfile(token, payload);

      setCurrentUser(updatedUser);
      setFullName(updatedUser.full_name || '');
      setEmail(updatedUser.email || '');
      setPhone(updatedUser.phone || '');
      setPassword('');

      setProfileMessage('Perfil actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando perfil:', error);

      if (error instanceof Error) {
        setProfileError(error.message);
      } else {
        setProfileError('No se pudo actualizar el perfil.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-(--color-primario) hover:underline"
      >
        Volver
      </button>

      <h1 className="text-2xl font-semibold text-(--color-fondo) mb-2">
        Ajustes de la cuenta
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Administra la información de tu perfil, seguridad y preferencias.
      </p>

      <SectionTitle title="Perfil del administrador" />

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 space-y-4">
        {isLoadingProfile ? (
          <p className="text-sm text-gray-500">Cargando perfil...</p>
        ) : (
          <>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primario)"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primario)"
                placeholder="correo@lecoquette.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4" />
                Teléfono
              </label>
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primario)"
                placeholder="Teléfono"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4" />
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primario)"
                placeholder="Dejar vacío para no cambiarla"
              />
            </div>

            {currentUser?.role?.name && (
              <p className="text-xs text-gray-500">
                Rol actual: <strong>{currentUser.role.name}</strong>
              </p>
            )}

            {profileMessage && (
              <p className="text-sm text-green-600">{profileMessage}</p>
            )}

            {profileError && (
              <p className="text-sm text-red-600">{profileError}</p>
            )}

            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-primario) text-white text-sm font-medium disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSavingProfile ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </>
        )}
      </div>

      <SectionTitle title="Notificaciones" />
      <ToggleRow
        icon={Mail}
        label="Correo"
        checked={notifications.email}
        onChange={(v) => updateNotif('email', v)}
      />

      <SectionTitle title="Seguridad" />
      <ToggleRow
        icon={Shield}
        label="2FA"
        checked={security.twoFactor}
        onChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))}
      />

      <ActionRow
        label="Cambiar contraseña"
        icon={Lock}
        onClick={() => setShowPasswordModal(true)}
      />

      <SectionTitle title="Preferencias" />
      <SelectRow
        icon={Globe}
        label="Idioma"
        value={preferences.language}
        options={[
          { value: 'es', label: 'Español' },
          { value: 'en', label: 'English' },
        ]}
        onChange={(v) => setPreferences((p) => ({ ...p, language: v }))}
      />

      <ActionRow
        label="Eliminar cuenta"
        icon={Trash2}
        onClick={() => {}}
        variant="danger"
      />

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

export default AccountSettingsPage;