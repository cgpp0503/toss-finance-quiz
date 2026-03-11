export type QuizType = {
    question: string;
    choices: string[];
    answer: number;
    explanation: string;
};

export type FinancialTerm = {
    id: number;
    term: string;
    summary: string;
    description: string;
    category: string;
    difficulty: string;
    tags: string[];
    quiz: QuizType;
    shareText: string;
};
