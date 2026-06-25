export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  level: number;
  points: number;
  unlockedRewards: string[];
}

export interface Question {
  id: string;
  level: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  requiredLevel: number;
}

export interface GameState {
  currentLevel: number;
  completedQuestions: string[];
  points: number;
  unlockedRewards: string[];
}
