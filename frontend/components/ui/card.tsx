import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("rr-card p-5", className)} {...props} />;
}

export function CardEyebrow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400 mb-1.5",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx("text-[15px] font-semibold text-white mb-3 tracking-tight", className)}
      {...(props as any)}
    />
  );
}
