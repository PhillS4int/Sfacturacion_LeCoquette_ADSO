import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";

interface StepNewPasswordProps {
  onNext: () => void;
}

const iconClass =
  "absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5";

const getChecks = (pwd: string) => [
  { label: "Mínimo 8 caracteres", pass: pwd.length >= 8 },
  { label: "Una letra mayúscula", pass: /[A-Z]/.test(pwd) },
  { label: "Un número", pass: /\d/.test(pwd) },
  { label: "Un carácter especial", pass: /[^A-Za-z0-9]/.test(pwd) },
];

const STRENGTH_LABELS = ["", "Débil", "Regular", "Buena", "Fuerte"];
const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

const StepNewPassword = ({ onNext }: StepNewPasswordProps) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checks = getChecks(password);
  const strength = checks.filter((c) => c.pass).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 4) {
      setError("Tu contraseña debe cumplir todos los requisitos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setLoading(true);
    // TODO: reemplazar con llamada real a la API
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    onNext();
  };

  return (
    <>
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(var(--color-primario-rgb, 180,140,80), 0.15)",
        }}
      >
        <KeyRound
          className="h-7 w-7"
          style={{ color: "var(--color-primario)" }}
        />
      </div>

      <h2 className="mb-1 text-[18px] font-light tracking-[2px] text-white">
        NUEVA CONTRASEÑA
      </h2>
      <p className="mb-7 text-[13px] text-gray-400 leading-relaxed">
        Elige una contraseña segura para proteger tu cuenta.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nueva contraseña */}
        <div className="relative w-full">
          <KeyRound className={iconClass} />
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="h-11.25 w-full bg-[#d9d9d9] pl-10 pr-10 text-[15px] text-black outline-none focus:ring-2 focus:ring-(--color-primario)"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 h-5 w-5"
          >
            {showPwd ? (
              <EyeOff className="h-full w-full" />
            ) : (
              <Eye className="h-full w-full" />
            )}
          </button>
        </div>

        {/* Barra de fortaleza */}
        {password && (
          <div className="-mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i <= strength ? STRENGTH_COLORS[strength] : "#3a3a3a",
                  }}
                />
              ))}
            </div>
            <p
              className="text-[11px] text-left"
              style={{ color: STRENGTH_COLORS[strength] }}
            >
              {STRENGTH_LABELS[strength]}
            </p>
          </div>
        )}

        {/* Checklist de requisitos */}
        <div className="text-left -mt-2 flex flex-col gap-1">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <div
                className="h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all duration-300"
                style={{
                  backgroundColor: c.pass ? "#22c55e" : "#3a3a3a",
                  color: "#fff",
                }}
              >
                {c.pass ? "✓" : ""}
              </div>
              <span
                className="text-[12px] transition-colors duration-300"
                style={{ color: c.pass ? "#22c55e" : "#666" }}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>

        {/* Confirmar contraseña */}
        <div className="relative w-full">
          <KeyRound className={iconClass} />
          <input
            type={showConf ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError("");
            }}
            className="h-11.25 w-full bg-[#d9d9d9] pl-10 pr-10 text-[15px] text-black outline-none focus:ring-2 focus:ring-(--color-primario)"
          />
          <button
            type="button"
            onClick={() => setShowConf(!showConf)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 h-5 w-5"
          >
            {showConf ? (
              <EyeOff className="h-full w-full" />
            ) : (
              <Eye className="h-full w-full" />
            )}
          </button>
        </div>

        {confirm && (
          <p
            className="text-[12px] -mt-2 text-left"
            style={{ color: password === confirm ? "#22c55e" : "#ef4444" }}
          >
            {password === confirm
              ? "✓ Las contraseñas coinciden"
              : "✗ Las contraseñas no coinciden"}
          </p>
        )}

        {error && (
          <p className="text-[13px] text-red-400 -mt-2 text-left">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12.5 bg-(--color-primario) text-[16px] font-bold text-(--color-secundario) transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              GUARDANDO...
            </>
          ) : (
            "CAMBIAR CONTRASEÑA"
          )}
        </button>
      </form>
    </>
  );
};

export default StepNewPassword;
