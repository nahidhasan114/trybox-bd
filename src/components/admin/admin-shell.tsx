"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems } from "./nav-items";
import { LogoutButton } from "./logout-button";
import type { AdminRole } from "@/lib/auth";

export function AdminShell({
  role,
  email,
  children,
}: {
  role: AdminRole;
  email: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const items = adminNavItems.filter((item) => !item.ownerOnly || role === "owner");

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
              active
                ? "bg-primary-50 text-primary-700"
                : "text-foreground/70 hover:bg-surface-muted",
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border px-4 py-4">
          <p className="font-semibold text-primary-700">TryBox BD</p>
          <p className="text-xs text-foreground/50">Admin Panel</p>
        </div>
        {nav}
        <div className="border-t border-border p-3">
          <p className="truncate px-3 text-xs text-foreground/50">{email}</p>
          <p className="px-3 text-xs font-medium capitalize text-primary-600">{role}</p>
          <LogoutButton />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div>
                <p className="font-semibold text-primary-700">TryBox BD</p>
                <p className="text-xs text-foreground/50">Admin Panel</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-surface-muted">
                <X className="size-5" />
              </button>
            </div>
            {nav}
            <div className="border-t border-border p-3">
              <p className="truncate px-3 text-xs text-foreground/50">{email}</p>
              <p className="px-3 text-xs font-medium capitalize text-primary-600">{role}</p>
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-surface-muted">
            <Menu className="size-5" />
          </button>
          <p className="font-semibold text-primary-700">TryBox BD Admin</p>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
