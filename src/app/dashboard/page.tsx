"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  logout,
  getQuestions,
  completeQuestion,
} from "@/lib/storage";
import type { User, Question } from "@/types";

/* ───────────────────────────────────────────────
   Dashboard Page — English Quest
   Protótipo profissional, sem exageros visuais.
   ─────────────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    setUser(currentUser);
    loadQuestion(currentUser.level);
  }, [router]);

  const loadQuestion = (level: number) => {
    const questions = getQuestions(level);
    const currentUser = getCurrentUser();
    const availableQuestions = questions.filter(
      (q) => !currentUser?.completedQuestions?.includes(q.id)
    );

    if (availableQuestions.length > 0) {
      setCurrentQuestion(
        availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      );
    } else if (level < 10) {
      loadQuestion(level + 1);
    } else {
      setCurrentQuestion(null);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || showResult || isTransitioning) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setIsTransitioning(true);
      completeQuestion(currentQuestion.id, 10);
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
        setIsTransitioning(false);
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
        loadQuestion(updatedUser?.level || 1);
      }, 2000);
    }
    // Se errar: não faz nada automático — o usuário verá o feedback
    // e poderá clicar em "Tentar novamente"
  };

  const handleRetry = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handlePracticeAgain = () => {
    if (!user) return;
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    loadQuestion(user.level);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-dvh">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <GamepadIcon />
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <StatBadge label="Nível" value={user.level} />
              <StatBadge label="Pontos" value={user.points} />
            </div>
            <div className="h-6 w-px bg-border" />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOutIcon />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────── */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Question Card */}
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
                isTransitioning={isTransitioning}
                onAnswer={handleAnswer}
                onRetry={handleRetry}
              />
            ) : (
              <CompletionCard onRetry={handlePracticeAgain} />
            )}
          </div>

          {/* Rewards Section */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <AwardIcon />
              Suas Recompensas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {user.unlockedRewards.length > 0 ? (
                user.unlockedRewards.map((rewardId) => (
                  <div
                    key={rewardId}
                    className="rounded-lg border border-border bg-accent/50 p-4 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mb-2">
                      <MedalIcon />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recompensa Desbloqueada
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground col-span-full text-center py-6">
                  Complete desafios para desbloquear recompensas.
                </p>
              )}
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<BookOpenIcon />}
              label="Questões Completadas"
              value={user.completedQuestions?.length || 0}
            />
            <StatCard
              icon={<FlameIcon />}
              label="Nível Atual"
              value={user.level}
            />
            <StatCard
              icon={<StarIcon />}
              label="Pontos Totais"
              value={user.points}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Sub-componentes
   ─────────────────────────────────────────────── */

function QuestionCard({
  question,
  selectedAnswer,
  showResult,
  isCorrect,
  isTransitioning,
  onAnswer,
  onRetry,
}: {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  isCorrect: boolean;
  isTransitioning: boolean;
  onAnswer: (index: number) => void;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="space-y-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          Nível {question.level}
        </span>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === question.correctAnswer;
          const isWrong = showResult && isSelected && !isCorrect;

          let variant: "default" | "correct" | "wrong" = "default";
          if (showResult && isCorrectAnswer) variant = "correct";
          else if (isWrong) variant = "wrong";

          return (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={showResult || isTransitioning}
              className={optionVariant(variant, isSelected)}
            >
              <span
                className={optionLetterVariant(variant, isSelected)}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div
          className={`rounded-lg border p-4 ${
            isCorrect
              ? "border-success/20 bg-success/10"
              : "border-destructive/20 bg-destructive/10"
          }`}
        >
          <p
            className={`text-sm font-semibold mb-1 ${
              isCorrect ? "text-success" : "text-destructive"
            }`}
          >
            {isCorrect ? "Correto!" : "Incorreto"}
          </p>
          <p className="text-sm text-muted-foreground">
            {question.explanation}
          </p>
          {isCorrect ? (
            <p className="text-xs text-muted-foreground mt-2">
              Próxima questão em 2 segundos...
            </p>
          ) : (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <RefreshIcon />
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CompletionCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 text-success mb-2">
        <TrophyIcon />
      </div>
      <h2 className="text-xl font-bold text-foreground">Parabéns!</h2>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Você completou todas as questões disponíveis no momento.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Praticar Novamente
      </button>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Helpers de estilo
   ─────────────────────────────────────────────── */

function optionVariant(
  variant: "default" | "correct" | "wrong",
  isSelected: boolean
): string {
  const base =
    "flex items-center gap-3 rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  if (variant === "correct") {
    return `${base} border-success bg-success/10 text-foreground`;
  }
  if (variant === "wrong") {
    return `${base} border-destructive bg-destructive/10 text-foreground`;
  }
  if (isSelected) {
    return `${base} border-primary bg-primary/5 text-foreground`;
  }
  return `${base} border-border bg-background text-foreground hover:border-primary/30 hover:bg-accent/50`;
}

function optionLetterVariant(
  variant: "default" | "correct" | "wrong",
  isSelected: boolean
): string {
  const base =
    "inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold shrink-0";

  if (variant === "correct") {
    return `${base} bg-success text-success-foreground`;
  }
  if (variant === "wrong") {
    return `${base} bg-destructive text-destructive-foreground`;
  }
  if (isSelected) {
    return `${base} bg-primary text-primary-foreground`;
  }
  return `${base} bg-muted text-muted-foreground`;
}

/* ───────────────────────────────────────────────
   Ícones (Lucide-style, inline SVG)
   ─────────────────────────────────────────────── */

function GamepadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2" />
      <path d="m13 12 5.88-9.8" />
      <path d="M8 7h8" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5a.5.5 0 0 0-.5.5c0 .28.22.5.5.5H12Z" />
    </svg>
  );
}

function BookOpenIcon() {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function FlameIcon() {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function StarIcon() {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
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

function RefreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mr-1.5"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}