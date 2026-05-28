import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "../../../assets/Le-Coquette-logo.svg";
import background from "../../../assets/Le-Coquette-background.jpg";
 
import StepIndicator from "../Forgotpassword/components/Stepindicator";
import type { Step } from "../Forgotpassword/components/Stepindicator";
import StepEmail               from "../Forgotpassword/components/Stepemail";
import StepCode                from "../Forgotpassword/components/Stepcode";
import StepNewPassword         from "../Forgotpassword/components/Stepnewpassword";
import StepSuccess             from "../Forgotpassword/components/Stepsuccess";
 
const ForgotPassword = () => {
  const [step, setStep]   = useState<Step>("email");
  const [email, setEmail] = useState("");
 
  return (
    <div
      className="flex min-h-screen items-center justify-center p-5"
      style={{
        backgroundImage:      "url(" + background + ")",
        backgroundSize:       "cover",
        backgroundPosition:   "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-100 bg-(--color-fondo) px-8.75 py-12.5 text-center text-(color-primario) my-5">
        {/* Logo */}
        <img src={logo} alt="Logo"
          className="mb-1.25 text-[36px] font-light tracking-[3px]" />
        <span className="mb-8 block text-[14px] tracking-[2px] text-(--color-primario)">
          SISTEMA DE FACTURACIÓN
        </span>
 
        {/* Indicador de pasos */}
        <StepIndicator current={step} />
 
        {/* Paso activo */}
        {step === "email" && (
          <StepEmail onNext={(e) => { setEmail(e); setStep("code"); }} />
        )}
        {step === "code" && (
          <StepCode
            email={email}
            onNext={() => setStep("newPassword")}
            onResend={() => console.log("Reenviar código a:", email)}
          />
        )}
        {step === "newPassword" && (
          <StepNewPassword onNext={() => setStep("success")} />
        )}
        {step === "success" && <StepSuccess />}
 
        {/* Volver al login */}
        {step !== "success" && (
          <div className="mt-6">
            <Link to="/login"
              className="flex items-center justify-center gap-1.5 text-[13px] text-gray-400 hover:text-(--boton-hover) transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default ForgotPassword;