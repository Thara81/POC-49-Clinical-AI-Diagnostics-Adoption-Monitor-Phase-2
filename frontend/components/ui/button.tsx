import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  active?: boolean;
}

export function Button({ className, variant = "outline", active, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
        variant === "primary" &&
          "bg-cyan text-obsidian border-cyan hover:brightness-110 rr-glow",
        variant === "outline" &&
          clsx(
            "border-slateBorder text-slate-300 hover:text-white hover:border-cyan/60",
            active && "border-cyan text-cyan rr-glow"
          ),
        variant === "ghost" && "border-transparent text-slate-400 hover:text-white",
        className
      )}
      {...props}
    />
  );
}
