"use client";

import { useEffect } from "react";
import Link from "next/link";
import { initializeStorage } from "@/lib/storage";

/* ───────────────────────────────────────────────
   Landing Page — English Quest
   Protótipo profissional, sem exageros visuais.
   ─────────────────────────────────────────────── */

export default function Home() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <main className="flex flex-col min-h-dvh">
      {/* ── Hero ───────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center px-6 py-16 sm:py-24">
        <div className="max-w-3xl w-full text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium border border-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Protótipo v0.1
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              English Quest
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Aprenda inglês de forma prática através de jogos, desafios interativos e
              experiências imersivas.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-surface border border-border text-foreground font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className="px-6 py-16 border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<TargetIcon />}
              title="Desafios"
              description="Questões interativas que adaptam-se ao seu nível de conhecimento."
            />
            <FeatureCard
              icon={<TrophyIcon />}
              title="Recompensas"
              description="Conquistas e prêmios exclusivos para manter sua motivação alta."
            />
            <FeatureCard
              icon={<TrendingIcon />}
              title="Progresso"
              description="Acompanhe sua evolução e suba de nível conforme avança."
            />
          </div>
        </div>
      </section>

      {/* ── Demo Credentials ───────────────────── */}
      <section className="px-6 py-10 border-t border-border">
        <div className="max-w-xl mx-auto">
          <div className="rounded-xl border border-border bg-muted/50 p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Credenciais de Teste
            </h2>
            <div className="space-y-3 text-sm">
              <CredentialRow
                role="Demo"
                email="demo@english.com"
                password="demo123"
              />
              <CredentialRow
                role="Admin"
                email="admin@english.com"
                password="admin123"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="px-6 py-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          English Quest — Protótipo. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}

/* ───────────────────────────────────────────────
   Sub-componentes
   ─────────────────────────────────────────────── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/30 hover:bg-accent/50">
      <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function CredentialRow({
  role,
  email,
  password,
}: {
  role: string;
  email: string;
  password: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="w-14 text-xs font-medium text-muted-foreground uppercase">
        {role}
      </span>
      <div className="flex-1 flex items-center gap-3 text-foreground">
        <span className="font-mono text-xs bg-background border border-border rounded px-2 py-1">
          {email}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-xs bg-background border border-border rounded px-2 py-1">
          {password}
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Ícones (Lucide-style, inline SVG)
   ─────────────────────────────────────────────── */

function TargetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}