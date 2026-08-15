import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100",
        error && "border-red-400 focus:border-red-400 focus:ring-red-100",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-foreground/80">{children}</label>;
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}
