"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  logout,
  getQuestions,
  addQuestion,
  deleteQuestion,
  getRewards,
  addReward,
} from "@/lib/storage";
import type { User, Question, Reward } from "@/types";

/* ───────────────────────────────────────────────
   Admin Page — English Quest
   Protótipo profissional, sem exageros visuais.
   ─────────────────────────────────────────────── */

type Tab = "questions" | "rewards";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("questions");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      router.push("/auth/login");
      return;
    }
    setUser(currentUser);
    loadQuestions();
    loadRewards();
  }, [router]);

  const loadQuestions = () => setQuestions(getQuestions());
  const loadRewards = () => setRewards(getRewards());

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-dvh">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <SettingsIcon />
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-medium text-foreground">
              Painel Admin
            </span>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOutIcon />
            Sair
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────── */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <TabBar activeTab={activeTab} onChange={setActiveTab} />

          {/* Content */}
          <div className="mt-8">
            {activeTab === "questions" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <QuestionForm onSuccess={loadQuestions} />
                <QuestionList
                  questions={questions}
                  onDelete={loadQuestions}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RewardForm onSuccess={loadRewards} />
                <RewardList rewards={rewards} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Tab Bar
   ─────────────────────────────────────────────── */

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "questions", label: "Questões", icon: <FileTextIcon /> },
    { id: "rewards", label: "Recompensas", icon: <AwardIcon /> },
  ];

  return (
    <div className="flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────
   Question Form
   ─────────────────────────────────────────────── */

function QuestionForm({ onSuccess }: { onSuccess: () => void }) {
  const [level, setLevel] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const question: Question = {
      id: `question-${Date.now()}`,
      level,
      question: questionText,
      options: [...options],
      correctAnswer,
      explanation,
    };

    addQuestion(question);
    onSuccess();

    // Reset
    setLevel(1);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setExplanation("");
    setIsLoading(false);
  };

  const updateOption = (idx: number, value: string) => {
    const next = [...options];
    next[idx] = value;
    setOptions(next);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <PlusIcon />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          Nova Questão
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectField
          id="q-level"
          label="Nível"
          value={String(level)}
          onChange={(v) => setLevel(Number(v))}
          options={Array.from({ length: 10 }, (_, i) => ({
            value: String(i + 1),
            label: `Nível ${i + 1}`,
          }))}
        />

        <TextField
          id="q-text"
          label="Pergunta"
          value={questionText}
          onChange={setQuestionText}
          placeholder="Digite a pergunta em inglês"
          required
        />

        {/* Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Opções de Resposta
          </label>
          <p className="text-xs text-muted-foreground">
            Selecione o rádio da resposta correta.
          </p>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="radio"
                name="correctAnswer"
                id={`correct-${idx}`}
                checked={correctAnswer === idx}
                onChange={() => setCorrectAnswer(idx)}
                className="h-4 w-4 accent-primary shrink-0"
              />
              <label htmlFor={`correct-${idx}`} className="sr-only">
                Opção {String.fromCharCode(65 + idx)} é a correta
              </label>
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Opção ${String.fromCharCode(65 + idx)}`}
                required
                className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <TextareaField
          id="q-explanation"
          label="Explicação"
          value={explanation}
          onChange={setExplanation}
          placeholder="Explique por que esta é a resposta correta"
          rows={3}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isLoading ? "Adicionando..." : "Adicionar Questão"}
        </button>
      </form>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Question List
   ─────────────────────────────────────────────── */

function QuestionList({
  questions,
  onDelete,
}: {
  questions: Question[];
  onDelete: () => void;
}) {
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta questão?")) {
      deleteQuestion(id);
      onDelete();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <ListIcon />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Questões Existentes
          </h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {questions.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
        {questions.length === 0 ? (
          <EmptyState message="Nenhuma questão cadastrada ainda." />
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="rounded-lg border border-border bg-background p-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                      Nível {q.level}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {q.question}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>
                      <span className="font-medium text-foreground">
                        Resposta:
                      </span>{" "}
                      {q.options[q.correctAnswer]}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Explicação:
                      </span>{" "}
                      {q.explanation}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Excluir questão"
                  title="Excluir questão"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Reward Form
   ─────────────────────────────────────────────── */

function RewardForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [requiredLevel, setRequiredLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const reward: Reward = {
      id: `reward-${Date.now()}`,
      name,
      description,
      cost,
      icon: "medal",
      requiredLevel,
    };

    addReward(reward);
    onSuccess();

    setName("");
    setDescription("");
    setCost(0);
    setRequiredLevel(1);
    setIsLoading(false);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <PlusIcon />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          Nova Recompensa
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          id="r-name"
          label="Nome"
          value={name}
          onChange={setName}
          placeholder="Ex: Badge Mestre"
          required
        />

        <TextField
          id="r-desc"
          label="Descrição"
          value={description}
          onChange={setDescription}
          placeholder="Ex: Complete 100 questões"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="r-cost"
            label="Custo (pontos)"
            value={cost}
            onChange={setCost}
            min={0}
          />
          <SelectField
            id="r-level"
            label="Nível Mínimo"
            value={String(requiredLevel)}
            onChange={(v) => setRequiredLevel(Number(v))}
            options={Array.from({ length: 10 }, (_, i) => ({
              value: String(i + 1),
              label: `Nível ${i + 1}`,
            }))}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isLoading ? "Adicionando..." : "Adicionar Recompensa"}
        </button>
      </form>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Reward List
   ─────────────────────────────────────────────── */

function RewardList({ rewards }: { rewards: Reward[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <ListIcon />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Recompensas Existentes
          </h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {rewards.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
        {rewards.length === 0 ? (
          <EmptyState message="Nenhuma recompensa cadastrada ainda." />
        ) : (
          rewards.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-border bg-background p-4 flex items-center gap-4"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                <MedalIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {r.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                    <StarIcon />
                    {r.cost} pts
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <LevelIcon />
                    Nível {r.requiredLevel}+
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Form Fields (reutilizáveis)
   ─────────────────────────────────────────────── */

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  min,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        className="w-full h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "2.5rem",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted text-muted-foreground mb-3">
        <InboxIcon />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Ícones (Lucide-style, inline SVG)
   ─────────────────────────────────────────────── */

function SettingsIcon() {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
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

function FileTextIcon() {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function AwardIcon() {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function PlusIcon() {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ListIcon() {
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
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
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

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
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

function LevelIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
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

function InboxIcon() {
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
      <polyline points="22 13 16 13 14 16 10 16 8 13 2 13" />
      <path d="M5.47 5.19 2 13v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3l-3.47-7.81A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.83 1.19z" />
    </svg>
  );
}