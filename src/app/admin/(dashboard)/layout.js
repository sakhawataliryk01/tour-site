import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  Compass,
  Users,
  HelpCircle,
  History,
  LogOut,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { site } from "@/lib/site";
import AdminTopNav from "@/components/admin/AdminTopNav";

export const metadata = {
  title: "Admin Panel — Kaiser Tours",
  description: "Kaiser Tours Reiseportal Administration",
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-olive text-paper-dark border-r border-stone-light/15 flex flex-col md:sticky md:h-screen md:top-0">
        <div className="p-5 border-b border-paper/10 flex items-center justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <Image
              src={site.logos.dark}
              alt={site.name}
              width={140}
              height={64}
              className="h-10 w-auto"
            />
            <span className="text-[10px] font-bold text-terracotta uppercase tracking-widest block font-mono">
              Portal Verwaltung
            </span>
          </div>
          <Link
            href="/"
            title="Zur öffentlichen Website"
            className="text-paper/60 hover:text-paper flex-shrink-0"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-4 bg-olive-dark/40 border-b border-paper/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-stone flex items-center justify-center font-serif text-sm text-paper font-bold shadow-inner">
            {user.name ? user.name.split(" ").map((n) => n[0]).join("") : "AD"}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-paper block leading-tight">
              {user.name || "Administrator"}
            </span>
            <span className="text-[10px] text-paper-dark/70 font-semibold truncate block">
              {user.email}
            </span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 font-sans font-semibold text-sm">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-paper/10 hover:text-paper transition-all text-paper-dark"
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/reisen"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-paper/10 hover:text-paper transition-all text-paper-dark"
          >
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span>Touren & Reisen</span>
          </Link>

          <Link
            href="/admin/anmeldungen"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-paper/10 hover:text-paper transition-all text-paper-dark"
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>Anmeldungen</span>
          </Link>

          <Link
            href="/admin/anfragen"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-paper/10 hover:text-paper transition-all text-paper-dark"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>Anfragen & Kontakt</span>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-paper/10 hover:text-paper transition-all text-paper-dark"
          >
            <History className="w-4 h-4 flex-shrink-0" />
            <span>System-Audit-Log</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-paper/10">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-terracotta/20 hover:text-paper transition-all text-paper-dark font-sans font-semibold text-sm w-full text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 flex-shrink-0 text-terracotta" />
              <span>Abmelden</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col bg-paper">
        <AdminTopNav userName={user.name || user.email} />
        <main className="flex-1 min-w-0 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
