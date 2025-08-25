export type Question = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  language: 'en' | 'ar';
  createdAt: Date;
  updatedAt?: Date;
  uid?: string; // User ID of the owner
};

export type Subject = {
  id: string;
  name: string;
};

export type Tag = {
    id: string;
    name: string;
}

export type Exam = {
    id: string;
    questions: Question[];
    userAnswers: { [questionId: string]: number };
    score: number;
    submitted: boolean;
    createdAt: Date;
    config: {
        subjects: string[];
        numQuestions: number;
        difficulty?: string;
        language?: string;
    }
}
