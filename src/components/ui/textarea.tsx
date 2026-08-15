import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100",
        className,
      )}
      rows={4}
      {...props}
    />
  );
}
