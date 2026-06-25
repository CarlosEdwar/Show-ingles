import { User, Question, Reward } from "@/types";

const STORAGE_KEYS = {
  USERS: "english_game_users",
  CURRENT_USER: "english_game_current_user",
  QUESTIONS: "english_game_questions",
  REWARDS: "english_game_rewards",
};

// Dados iniciais
const defaultQuestions: Question[] = [
  {
    id: "1",
    level: 1,
    question: 'What is the correct translation of "Bom dia"?',
    options: ["Good night", "Good morning", "Good afternoon", "Hello"],
    correctAnswer: 1,
    explanation: '"Good morning" é a tradução correta para "Bom dia".',
  },
  {
    id: "2",
    level: 1,
    question: 'Which word means "Livro" in English?',
    options: ["Pen", "Book", "Table", "Chair"],
    correctAnswer: 1,
    explanation: '"Book" significa "Livro" em inglês.',
  },
  {
    id: "3",
    level: 2,
    question: "Choose the correct sentence:",
    options: [
      "She don't like coffee",
      "She doesn't like coffee",
      "She not like coffee",
      "She no like coffee",
    ],
    correctAnswer: 1,
    explanation: `A forma correta é "She doesn't like coffee" (terceira pessoa do singular).`,
  },
  {
    id: "4",
    level: 2,
    question: 'What is the past tense of "go"?',
    options: ["Goed", "Gone", "Went", "Going"],
    correctAnswer: 2,
    explanation: 'O passado de "go" é "went".',
  },
  {
    id: "5",
    level: 3,
    question: 'Complete: "If I ___ rich, I would travel the world."',
    options: ["am", "was", "were", "be"],
    correctAnswer: 2,
    explanation: 'No second conditional usamos "were" para todas as pessoas.',
  },
];

const defaultRewards: Reward[] = [
  {
    id: "1",
    name: "Badge Iniciante",
    description: "Complete o nível 1",
    cost: 0,
    icon: "medal",
    requiredLevel: 1,
  },
  {
    id: "2",
    name: "Badge Intermediário",
    description: "Complete o nível 2",
    cost: 0,
    icon: "medal",
    requiredLevel: 2,
  },
  {
    id: "3",
    name: "Badge Avançado",
    description: "Complete o nível 3",
    cost: 0,
    icon: "medal",
    requiredLevel: 3,
  },
  {
    id: "4",
    name: "Avatar Premium",
    description: "Desbloqueie um avatar especial",
    cost: 100,
    icon: "medal",
    requiredLevel: 2,
  },
  {
    id: "5",
    name: "Tema Dourado",
    description: "Tema exclusivo dourado",
    cost: 200,
    icon: "medal",
    requiredLevel: 3,
  },
];

/* ───────────────────────────────────────────────
   Inicialização
   ─────────────────────────────────────────────── */

export function initializeStorage() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUser: User = {
      id: "demo-1",
      email: "demo@english.com",
      password: "demo123",
      name: "Usuário Demo",
      isAdmin: false,
      level: 1,
      points: 0,
      unlockedRewards: [],
      completedQuestions: [],
    };

    const adminUser: User = {
      id: "admin-1",
      email: "admin@english.com",
      password: "admin123",
      name: "Administrador",
      isAdmin: true,
      level: 1,
      points: 0,
      unlockedRewards: [],
      completedQuestions: [],
    };

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([demoUser, adminUser]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(defaultQuestions));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(defaultRewards));
  }
}

/* ───────────────────────────────────────────────
   Autenticação
   ─────────────────────────────────────────────── */

export function registerUser(
  email: string,
  password: string,
  name: string
): { success: boolean; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Erro no servidor" };
  }

  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "E-mail já cadastrado" };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    isAdmin: false,
    level: 1,
    points: 0,
    unlockedRewards: [],
    completedQuestions: [],
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  return { success: true, message: "Cadastro realizado com sucesso!" };
}

export function login(
  email: string,
  password: string
): { success: boolean; user?: User; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Erro no servidor" };
  }

  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: "E-mail ou senha incorretos" };
  }

  // Normaliza o campo completedQuestions para usuários antigos
  const normalizedUser: User = {
    ...user,
    completedQuestions: user.completedQuestions ?? [],
  };

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(normalizedUser));

  return { success: true, user: normalizedUser, message: "Login realizado com sucesso!" };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userStr) return null;

  const user: User = JSON.parse(userStr);

  // Normaliza o campo completedQuestions para usuários antigos
  return {
    ...user,
    completedQuestions: user.completedQuestions ?? [],
  };
}

export function updateUser(updatedUser: User) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

/* ───────────────────────────────────────────────
   Questões
   ─────────────────────────────────────────────── */

export function getQuestions(level?: number): Question[] {
  if (typeof window === "undefined") return [];

  const questions: Question[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.QUESTIONS) || "[]"
  );

  if (level !== undefined) {
    return questions.filter((q) => q.level === level);
  }

  return questions;
}

export function addQuestion(question: Question) {
  if (typeof window === "undefined") return;

  const questions: Question[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.QUESTIONS) || "[]"
  );
  questions.push(question);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

export function deleteQuestion(id: string) {
  if (typeof window === "undefined") return;

  const questions: Question[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.QUESTIONS) || "[]"
  );
  const filtered = questions.filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(filtered));
}

/* ───────────────────────────────────────────────
   Recompensas
   ─────────────────────────────────────────────── */

export function getRewards(): Reward[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARDS) || "[]");
}

export function addReward(reward: Reward) {
  if (typeof window === "undefined") return;

  const rewards: Reward[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.REWARDS) || "[]"
  );
  rewards.push(reward);
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
}

export function unlockReward(userId: string, rewardId: string) {
  if (typeof window === "undefined") return;

  const user = getCurrentUser();
  if (!user || user.id !== userId) return;

  if (!user.unlockedRewards.includes(rewardId)) {
    user.unlockedRewards.push(rewardId);
    updateUser(user);
  }
}

/* ───────────────────────────────────────────────
   Progresso
   ─────────────────────────────────────────────── */

export function completeQuestion(questionId: string, points: number) {
  if (typeof window === "undefined") return;

  const user = getCurrentUser();
  if (!user) return;

  // Garante que completedQuestions existe
  if (!user.completedQuestions) {
    user.completedQuestions = [];
  }

  if (!user.completedQuestions.includes(questionId)) {
    user.points += points;
    user.completedQuestions.push(questionId);

    // Verificar progresso de nível
    const questionsPerLevel = 2;
    const completedAtLevel = user.completedQuestions.filter((qId) => {
      const question = getQuestions().find((qt) => qt.id === qId);
      return question?.level === user.level;
    }).length;

    if (completedAtLevel >= questionsPerLevel && user.level < 10) {
      user.level += 1;
    }

    updateUser(user);
  }

  return user;
}