import type { Metadata } from "next";
import { Archivo, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-sans", subsets: ["latin"] });
const dmSerif = DM_Serif_Display({ variable: "--font-serif", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Buenaventura se levanta",
  description: "Portal ciudadano de información, ayuda y esperanza para la emergencia sísmica en Buenaventura.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${archivo.variable} ${dmSerif.variable}`}>{children}</body></html>;
}
