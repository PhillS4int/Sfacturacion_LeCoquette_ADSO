import { useState } from "react";
import { Mail } from "lucide-react";

interface StepEmailProps {
  onNext: (email: string) => void;
}

const iconClass =
  "absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5";

const StepEmail = ({ onNext }: StepEmailProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setError("");
    setLoading(true);

    //TODO: Reemplazar con la llamada real a la API
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    onNext(email);
  };

  return (
    <>
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(var(--color-primario-rgb, 180,140,80), 0.15)",
        }}
      >
        <Mail className="h-7 w-7" style={{ color: "var(--color-primario)" }} />
      </div>

      <h2 className="mb-1 text-[18px] font-light tracking-[2px] text-white">
        RECUPERAR CONTRASEÑA
      </h2>
      <p className="mb-7 text-[13px] text-gray-400 leading-relaxed">
        Ingresa el correo asociado a tu cuenta y te enviaremos un código de
        verificación.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative w-full">
          <Mail className={iconClass} />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="h-11.25 w-full bg-[#d9d9d9] pl-10 pr-3.75 text-[15px] text-(--texto-input) placeholder-(--texto-input) outline-none focus:ring-2 focus:ring-(--color-primario)"
            autoComplete="email"
          />
        </div>

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
              ENVIANDO...
            </>
          ) : (
            "ENVIAR CÓDIGO"
          )}
        </button>
      </form>
    </>
  );
};

export default StepEmail;