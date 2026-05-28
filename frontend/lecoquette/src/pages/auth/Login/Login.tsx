import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/Le-Coquette-logo.svg";
import background from "../../../assets/Le-Coquette-background.jpg";
import { authService } from "../../../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await authService.login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al iniciar sesión");
    }
  };

  const iconDecorationClass =
    "absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5";

  return (
    <div
      className="flex h-screen items-center justify-center p-5"
      style={{
        backgroundImage: "url(" + background + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-100 bg-(--color-fondo) px-8.75 py-12.5 text-center text-white">
        <img
          src={logo}
          alt="Logo"
          className="mb-1.25 text-[36px] font-light tracking-[3px]"
        />

        <span className="mb-10 block text-[14px] tracking-[2px] text-(--color-primario)">
          BIENVENIDO
        </span>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative w-full">
            <User className={iconDecorationClass} />

            <input
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11.25 w-full bg-[#d9d9d9] pl-10 pr-3.75 text-[15px] text-black outline-none focus:ring-2 focus:ring-(--color-primario)"
            />
          </div>

          <div className="relative w-full">
            <Lock className={iconDecorationClass} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11.25 w-full bg-[#d9d9d9] pl-10 pr-10 text-[15px] text-black outline-none focus:ring-2 focus:ring-(--color-primario)"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 h-5 w-5"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff className="h-full w-full" />
              ) : (
                <Eye className="h-full w-full" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="h-12.5 bg-(--color-primario) text-[18px] font-bold text-(--color-secundario) transition-opacity hover-(--boton-hover) hover:opacity-90"
          >
            INGRESAR
          </button>
        </form>

        <div className="mt-3.75 flex flex-col gap-3 text-[15px] text-(--color-primario)">
          <div className="flex items-center justify-center gap-2">
            <input type="checkbox" id="remember" className="cursor-pointer" />
            <label htmlFor="remember" className="cursor-pointer">
              Recordarme
            </label>
          </div>

          <Link
            to="/recuperar-contrasena"
            className="hover:underline font-bold"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <p>
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro"
              className="cursor-pointer font-bold hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;