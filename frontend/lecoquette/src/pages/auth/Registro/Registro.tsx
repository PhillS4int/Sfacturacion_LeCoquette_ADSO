import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/Le-Coquette-logo.svg";
import background from "../../../assets/Le-Coquette-background.jpg";
 
type Rol = "empleado" | "administrador" | "";

interface RegisterForm {
    nombres: string;
    apellidos: string;
    cedula: string;
    fechaNacimiento: string;
    correo: string;
    telefono: string;
    password: string;
    confirmPassword: string;
    rol: Rol;
}

const Registro = () => {
    const navigate = useNavigate();
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [form, setForm] = useState<RegisterForm>({
        nombres: "",
        apellidos: "",
        cedula: "",
        fechaNacimiento: "",
        correo: "",
        telefono: "",
        password: "",
        confirmPassword: "",
        rol: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
        
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Validar que todos los campos del formulario estén completos.
        const camposVacios = Object.entries(form).filter(([, valor]) => valor.trim() === "");
        if (camposVacios.length > 0) {
            alert("Por favor completa todos los campos del formulario antes de registrarte.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        console.log("Datos del registro", form);
        //Aquí iría la llamada a tu API/backend
        setRegistroExitoso(true);
    };

    const inputClass = "w-full bg-[white] border border-[var(--color-primario)] px-4 py-3 text-[var(--texto-input)] placeholder-[var(--texto-input)] text-sm focus:outline-none focus:border-[var(--boton-hover)] transition-colors";

    const labelClass = "block text-[var(--color-primario)] text-sm font-medium mb-1";

    
    // Aquí deberías agregar el return con tu JSX
    return (

    // Contenedor principal con fondo       
    <div
     className="min-h-screen flex items-start justify-center p-5 overflow-y-auto"
      style={{
        backgroundImage: "url(" + background + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",        
      }}
    >      
      
      {/* Decorative background lines (subtle) */}      

            <div className="relative w-full max-w-sm bg-(--color-fondo) px-8 py-10 shadow-2xl">
                
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="Logo"
                        className="mb-1.25 text-[36px] tracking-[3px]"
                    />       
                </div>

                {/* ── Mensaje de éxito ── */}
                {registroExitoso ? (
                    <div className="flex flex-col items-center text-center space-y-6 py-4">
 
                        {/* Ícono de verificación */}
                        <div
                            className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-(--color-primario)"
                            style={{ animation: "scaleFadeIn 0.4s ease forwards" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-(--color-primario)"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
 
                        {/* Título */}
                        <h2 className="text-(--color-primario) text-2xl font-bold tracking-widest uppercase">
                            ¡Registro exitoso!
                        </h2>
 
                        {/* Línea decorativa */}
                        <div className="w-16 h-px bg-(--color-primario) opacity-50" />
 
                        {/* Mensaje */}
                        <p className="text-(--color-primario) text-sm leading-relaxed opacity-80">
                            Tu cuenta ha sido creada correctamente.
                            <br />
                            Ya puedes iniciar sesión con tus credenciales.
                        </p>
 
                        {/* Botón al Login */}
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-(--color-primario) hover:bg-(--boton-hover) text-(--color-secundario) font-bold tracking-[0.2em] text-lg py-3 transition-colors duration-200 uppercase mt-2"
                        >
                            INICIAR SESIÓN
                        </button>
                    </div>
                ) : (
                    /* ── Formulario ── */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelClass}>Nombres completos:</label>
                            <input
                                type="text"
                                name="nombres"
                                placeholder="Ejemplo: Jessica Andrea"
                                value={form.nombres}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Apellidos:</label>
                            <input
                                type="text"
                                name="apellidos"
                                placeholder="Ejemplo: Rodríguez Pérez"
                                value={form.apellidos}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Cédula:</label>
                            <input
                                type="text"
                                name="cedula"
                                placeholder="Ingresa tu número de cédula"
                                value={form.cedula}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Fecha de nacimiento:</label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={form.fechaNacimiento}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Correo electrónico:</label>
                            <input
                                type="email"
                                name="correo"
                                placeholder="Ejemplo: tucorreo@email.com"
                                value={form.correo}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Teléfono:</label>
                            <input
                                type="tel"
                                name="telefono"
                                placeholder="Ejemplo: 320123456"
                                value={form.telefono}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Contraseña:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Registra tu contraseña"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Confirmar contraseña:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Vuelve a ingresar la contraseña"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>Elige el rol asignado:</label>
                            <select
                                name="rol"
                                value={form.rol}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="" disabled hidden className="bg-[#1e1a16] text-[--color-primario]">
                                    Selecciona un rol
                                </option>   
                                <option value="empleado" className="bg-[#1e1a16] text-[--color-primario]">
                                    Empleado
                                </option>
                                <option value="administrador" className="bg-[#1e1a16] text-[--color-primario]">
                                    Administrador
                                </option>
                            </select>
                        </div>
 
                        {/* Submit button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-(--color-primario) hover:bg-(--boton-hover) text-(--color-secundario) font-bold tracking-[0.2em] text-lg py-3 transition-colors duration-200 uppercase"
                            >
                                REGISTRARSE
                            </button>                            
                        </div>
 
                        {/* Login link */}
                        <p className="text-center text-(--color-primario) text-base pt-1">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-bold cursor-pointer hover:text-(--boton-hover) hover:underline transition-colors"
                            >
                                Ingresar
                            </Link>
                        </p>
                    </form>
                )}
 
                {/* Animación del ícono de éxito */}
                <style>{`
                    @keyframes scaleFadeIn {
                        from { opacity: 0; transform: scale(0.6); }
                        to   { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        </div>
    );
};
 
export default Registro;
