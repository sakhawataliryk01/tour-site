"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Users,
  HelpCircle,
  History,
  Home,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reisen", label: "Reisen", icon: Compass },
  { href: "/admin/anmeldungen", label: "Anmeldungen", icon: Users },
  { href: "/admin/anfragen", label: "Anfragen", icon: HelpCircle },
  { href: "/admin/audit-logs", label: "Audit", icon: History },
];

function isActive(pathname, href, exact) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminTopNav({ userName }) {
  const pathname = usePathname() || "/admin";

  return (
    <header className="sticky top-0 z-30 border-b border-stone-light/70 bg-paper/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 h-14">
        <nav className="flex items-center gap-0.5 overflow-x-auto min-w-0 -mx-1 px-1">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  active
                    ? "bg-olive/10 text-olive"
                    : "text-ink/50 hover:text-olive hover:bg-paper-dark"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {userName ? (
            <span className="hidden md:inline text-[11px] font-semibold text-ink/45 truncate max-w-[140px]">
              {userName}
            </span>
          ) : null}
          <Link
            href="/"
            title="Zur Website"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-stone text-ink/50 hover:text-olive hover:border-olive transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              title="Abmelden"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-stone text-terracotta hover:bg-terracotta/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
