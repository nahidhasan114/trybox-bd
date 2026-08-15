import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-surface-muted disabled:opacity-50",
  ghost: "text-foreground hover:bg-surface-muted disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
