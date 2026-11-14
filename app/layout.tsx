import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KioskGuard } from "@/components/kiosk/kiosk-guard";
import { getKioskConfig } from "@/lib/config";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

// next/font scarica i font in fase di build e li serve dal container:
// nessuna richiesta a Google a runtime.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    title: getKioskConfig().title,
    icons: { icon: "/logo.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <KioskGuard />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
