export type LevelType = 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent';

export interface Lesson {
  id: number;
  level: LevelType;
  title: string;
  topic: string;
  content: {
    pt: string;
    en: string;
    grammarNote?: string;
  };
  quiz: {
    question: string;
    answer: string; // The correct answer string
    options?: string[]; // Optional for multiple choice in future
  };
}

export interface UserProgress {
  currentLessonId: number;
  completedLessons: number[];
}

export const LEVELS: LevelType[] = ['Basic', 'Intermediate', 'Advanced', 'Fluent'];