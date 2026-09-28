"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth";
import { LogIn, Key, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-paper-dark border border-stone-light p-8 rounded-xl shadow-md">
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-2xl">🕊️</span>
          <h1 className="text-3xl font-serif font-bold text-olive">
            Beth-Shalom
          </h1>
          <p className="text-xs text-ink/60 font-semibold uppercase tracking-wider">
            Reiseportal-Verwaltung
          </p>
        </div>

        {/* Status Error */}
        {errorMessage && (
          <div className="p-4 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-lg flex gap-2 text-sm font-semibold items-center">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Credentials Form */}
        <form action={formAction} className="space-y-6 font-semibold text-sm text-olive">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-ink/65 uppercase">
                Benutzer (E-Mail)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full bg-paper pl-10 pr-3 py-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                  placeholder="admin@beth-shalom.reisen"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-ink/65 uppercase">
                Passwort
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink/40">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-paper pl-10 pr-3 py-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary py-3 px-4 font-semibold w-full text-center flex justify-center items-center gap-2 cursor-pointer shadow-md text-base"
            >
              <LogIn className="w-5 h-5" />
              {isPending ? "Anmeldung..." : "Anmelden"}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-ink/45 hover:text-terracotta font-semibold">
            ← Zurück zur Hauptseite
          </a>
        </div>
      </div>
    </div>
  );
}
