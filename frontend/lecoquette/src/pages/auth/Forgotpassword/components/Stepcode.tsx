import { useState, useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";
 
interface StepCodeProps {
  email: string;
  onNext: (code: string) => void;
  onResend: () => void;
}
 
const CODE_LENGTH    = 6;
const RESEND_SECONDS = 60;
 
const StepCode = ({ email, onNext, onResend }: StepCodeProps) => {
  const [digits, setDigits]     = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
 
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);
 
  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
  };
 
  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
 
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    refs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) { setError("Ingresa el código completo de 6 dígitos."); return; }
    setLoading(true);
    // TODO: reemplazar con llamada real a la API
    await new Promise((res) => setTimeout(res, 1200));
    if (code === "000000") { setError("Código incorrecto. Inténtalo de nuevo."); setLoading(false); return; }
    setLoading(false);
    onNext(code);
  };
 
  const handleResend = () => {
    setCountdown(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(""));
    setError("");
    onResend();
  };
 
  const maskedEmail = email.replace(/(.{2}).+(@.+)/, "$1****$2");
 
  return (
    <>
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(var(--color-primario-rgb, 180,140,80), 0.15)" }}
      >
        <ShieldCheck className="h-7 w-7" style={{ color: "var(--color-primario)" }} />
      </div>
 
      <h2 className="mb-1 text-[18px] font-light tracking-[2px] text-white">
        VERIFICAR CÓDIGO
      </h2>
      <p className="mb-2 text-[13px] text-gray-400">Enviamos un código de {CODE_LENGTH} dígitos a</p>
      <p className="mb-7 text-[13px] font-bold tracking-wide" style={{ color: "var(--color-primario)" }}>
        {maskedEmail}
      </p>
 
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-12 w-10 bg-[#d9d9d9] text-center text-[20px] font-bold text-black outline-none focus:ring-2 focus:ring-(--color-primario) transition-all"
            />
          ))}
        </div>
 
        {error && <p className="text-[13px] text-red-400 text-center -mt-2">{error}</p>}
 
        <button
          type="submit"
          disabled={loading}
          className="h-12 bg-(--color-primario) text-[16px] font-bold text-(--color-secundario) transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />VERIFICANDO...</>
          ) : "VERIFICAR CÓDIGO"}
        </button>
      </form>
 
      <div className="mt-4 text-[13px] text-gray-500">
        {countdown > 0 ? (
          <p>Reenviar código en <span style={{ color: "var(--color-primario)" }}>{countdown}s</span></p>
        ) : (
          <button onClick={handleResend} className="font-bold hover:underline" style={{ color: "var(--color-primario)" }}>
            Reenviar código
          </button>
        )}
      </div>
    </>
  );
};
 
export default StepCode;