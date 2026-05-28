import React from "react";
import { CheckCircle2 } from "lucide-react";

export type Step = "email" | "code" | "newPassword" | "success";

interface StepIndicatorProps {
  current: Step;
}

const STEPS: Step[] = ["email", "code", "newPassword"];
const STEP_LABELS = ["Correo", "Código", "Contraseña"];

const StepIndicator = ({ current }: StepIndicatorProps) => {
  const currentIndex = STEPS.indexOf(current);

  if (current === "success") return null;

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                backgroundColor:
                  i <= currentIndex ? "var(--color-primario)" : "#3a3a3a",
                color: i <= currentIndex ? "var(--color-secundario)" : "#888",
              }}
            >
              {i < currentIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className="text-[10px] tracking-[1px] transition-all duration-300"
              style={{
                color: i <= currentIndex ? "var(--color-primario)" : "#555",
              }}
            >
              {STEP_LABELS[i]}
            </span>
          </div>

          {i < STEPS.length - 1 && (
            <div
              className="h-0.5 w-10 mb-4 transition-all duration-500"
              style={{
                backgroundColor:
                  i < currentIndex ? "var(--color-primario)" : "#3a3a3a",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
