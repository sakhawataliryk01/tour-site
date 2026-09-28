"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Log in admin using Credentials
 */
export async function authenticate(prevState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return "Bitte geben Sie E-Mail-Adresse und Passwort ein.";
    }

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/admin",
    });

    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return "Ungültige E-Mail-Adresse oder Passwort.";
        default:
          return "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.";
      }
    }
    // Very important: Next-Auth redirects are handled by throwing a RedirectError.
    // We must let it bubble up so Next.js can perform the redirection.
    throw error;
  }
}

/**
 * Sign out administrator
 */
export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
