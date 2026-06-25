import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* ───────────────────────────────────────────────
   Fontes
   ─────────────────────────────────────────────── */
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ───────────────────────────────────────────────
   Metadados
   ─────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "English Quest — Aprenda Inglês Jogando",
    template: "%s | English Quest",
  },
  description:
    "Plataforma de ensino de inglês através de jogos, desafios interativos e experiências imersivas.",
  keywords: ["inglês", "aprender inglês", "jogos educativos", "english", "gamificação"],
  authors: [{ name: "English Quest" }],
  creator: "English Quest",
  metadataBase: new URL("https://englishquest.app"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "English Quest",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ───────────────────────────────────────────────
   Layout Root
   ─────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}