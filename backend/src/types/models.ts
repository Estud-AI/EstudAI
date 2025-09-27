// TypeScript interfaces mirroring the Prisma models in prisma/schema.prisma

export type Level = 'EASY' | 'MEDIUM' | 'HARD';

export interface User {
  id: number;
  name: string;
  email: string;
  dayStreak: number;
  subjects?: Subject[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Subject {
  id: number;
  name: string;
  progress: number;
  userId: number;
  user?: User;
  summaries?: Summary[];
  flashcards?: Flashcard[];
  tests?: Test[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Summary {
  id: number;
  texto: string;
  nome: string;
  subjectId: number;
  subject?: Subject;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  level: Level;
  subjectId: number;
  subject?: Subject;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Test {
  id: number;
  name: string;
  attemps: number;
  accurateAnswers: number;
  subjectId: number;
  subject?: Subject;
  questions?: Questions[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Questions {
  id: number;
  testId: number;
  quest: string;
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  correctAnswer: number; // 1..4
  test?: Test;
  createdAt: string | Date;
  updatedAt: string | Date;
}
