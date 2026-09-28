import { Geist, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const loraSerif = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Beth-Shalom Israelreisen — Bibel, Land, Volk",
    template: "%s | Beth-Shalom Israelreisen"
  },
  description: "Erleben Sie christliche Israelreisen mit Beth-Shalom. Seit 1970 geführte, biblisch geprägte Rundreisen durch das Heilige Land.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${loraSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
