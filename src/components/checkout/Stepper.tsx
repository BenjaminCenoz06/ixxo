import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Carrito", "Entrega", "Pago"];

export default function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-medium transition-colors",
                  done && "border-ink bg-ink text-paper",
                  active && "border-ink text-ink",
                  !done && !active && "border-line text-stone",
                )}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[12px] uppercase tracking-[0.14em] transition-colors",
                  active || done ? "text-ink" : "text-stone",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={cn("h-px w-8 md:w-16", done ? "bg-ink" : "bg-line")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
