import { useEffect, useState } from "react";
import { Plus, RefreshCw, Save, UserCheck, UserX } from "lucide-react";
import {
  userService,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
} from "../../../services/user.service";

type UserFormMode = "create" | "edit";

const roleOptions = [
  { id: 1, label: "Administrador" },
  { id: 2, label: "Empleado" },
];

function getRoleLabel(roleName?: string | null) {
  if (!roleName) return "Sin rol";
  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mode, setMode] = useState<UserFormMode>("create");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(2);
  const [isActive, setIsActive] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setSelectedUser(null);
    setMode("create");
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRoleId(2);
    setIsActive(true);
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setMode("edit");
    setFullName(user.full_name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setRoleId(user.role?.id || user.role_id || 2);
    setIsActive(user.is_active);
    setPassword("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim()) {
      alert("El nombre completo es obligatorio.");
      return;
    }

    if (!email.trim()) {
      alert("El correo electrónico es obligatorio.");
      return;
    }

    if (mode === "create" && !password.trim()) {
      alert("La contraseña es obligatoria para crear un usuario.");
      return;
    }

    try {
      setSaving(true);

      if (mode === "create") {
        const payload: CreateUserPayload = {
          role_id: roleId,
          full_name: fullName,
          email,
          phone,
          password,
        };

        await userService.create(payload);
        alert("Usuario creado correctamente.");
      } else if (selectedUser) {
        const payload: UpdateUserPayload = {
          role_id: roleId,
          full_name: fullName,
          email,
          phone,
          is_active: isActive,
        };

        if (password.trim()) {
          payload.password = password;
        }

        await userService.update(selectedUser.id, payload);
        alert("Usuario actualizado correctamente.");
      }

      resetForm();
      await loadUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error guardando usuario");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(user: User) {
    const confirmed = window.confirm(
      `¿Seguro que deseas desactivar al usuario ${user.full_name}?`
    );

    if (!confirmed) return;

    try {
      await userService.deactivate(user.id);
      alert("Usuario desactivado correctamente.");
      await loadUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error desactivando usuario");
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-(--color-fondo) font-bold text-xl">Usuarios</h2>
          <p className="mt-1 text-gray-600">
            Gestiona los usuarios del sistema y asigna roles de administrador o empleado.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-lg bg-(--color-fondo) px-4 py-2 text-sm font-medium text-(--color-primario)"
        >
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-xl border bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Usuarios registrados</h3>

            <button
              onClick={loadUsers}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Cargando usuarios...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 pr-3">Nombre</th>
                    <th className="py-3 pr-3">Correo</th>
                    <th className="py-3 pr-3">Rol</th>
                    <th className="py-3 pr-3">Estado</th>
                    <th className="py-3 pr-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 pr-3 font-medium">{user.full_name}</td>
                      <td className="py-3 pr-3">{user.email}</td>
                      <td className="py-3 pr-3">
                        {getRoleLabel(user.role?.name)}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            user.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
                          >
                            Editar
                          </button>

                          {user.is_active && (
                            <button
                              onClick={() => handleDeactivate(user)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            >
                              Desactivar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-4 font-semibold text-gray-800">
            {mode === "create" ? "Crear usuario" : "Editar usuario"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="correo@lecoquette.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Teléfono"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                value={roleId}
                onChange={(event) => setRoleId(Number(event.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {mode === "edit" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(event) => setIsActive(event.target.value === "true")}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {mode === "create" ? "Contraseña" : "Nueva contraseña"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={
                  mode === "create"
                    ? "Contraseña"
                    : "Dejar vacío para no cambiarla"
                }
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-(--color-fondo) px-4 py-2 text-sm font-medium text-(--color-primario) disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Guardando..." : "Guardar"}
              </button>

              {mode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <p className="flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" />
              Administrador: puede gestionar usuarios y editar su perfil.
            </p>
            <p className="mt-1 flex items-center gap-1">
              <UserX className="h-3.5 w-3.5" />
              Empleado: puede operar el sistema, pero no editar perfil ni usuarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;