import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StepSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/login"), 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(34,197,94,0.15)",
          animation: "pulse 2s infinite",
        }}
      >
        <CheckCircle2 className="h-10 w-10 text-green-500" />
      </div>

      <h2 className="text-[18px] font-light tracking-[2px] text-white">
        ¡CONTRASEÑA ACTUALIZADA!
      </h2>
      <p className="text-[13px] text-gray-400 leading-relaxed max-w-65">
        Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio
        de sesión en unos segundos.
      </p>

      <Link
        to="/login"
        className="mt-3 h-12.5 w-full flex items-center justify-center bg-(--color-primario) text-[16px] font-bold text-(--color-secundario) transition-opacity hover:opacity-90"
      >
        IR AL LOGIN
      </Link>
    </div>
  );
};

export default StepSuccess;
