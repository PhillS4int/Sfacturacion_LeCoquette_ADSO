import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSubmit?: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
}

export function ChangePasswordModal({
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    current.length >= 6 &&
    next.length >= 8 &&
    next === confirm;

  async function handleSubmit() {
    if (!isValid) return;

    try {
      setLoading(true);
      setError(null);

      if (onSubmit) {
        await onSubmit({
          currentPassword: current,
          newPassword: next,
        });
      }

      setSaved(true);

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        {/* Header */}
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Cambiar contraseña
        </h3>

        {/* Form */}
        <div className="space-y-3">

          {/* Current Password */}
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Contraseña actual
            </label>

            <div className="relative mt-1">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Nueva contraseña
            </label>

            <div className="relative mt-1">
              <input
                type={showNext ? 'text' : 'password'}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Mínimo 8 caracteres"
              />

              <button
                type="button"
                onClick={() => setShowNext((v) => !v)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showNext ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Confirmar nueva contraseña
            </label>

            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full mt-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                confirm && next !== confirm
                  ? 'border-red-300'
                  : 'border-gray-200'
              }`}
              placeholder="Repite la nueva contraseña"
            />

            {confirm && next !== confirm && (
              <p className="text-xs text-red-500 mt-1">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || saved}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Guardado
              </>
            ) : loading ? (
              'Guardando...'
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}