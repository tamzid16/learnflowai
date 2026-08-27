export type Topic = {
  title: string;
  explanation: string;
  weight: number;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type StudySession = {
  day: string;
  focus: string;
  minutes: number;
  tasks: string[];
};

export type StudyPack = {
  title: string;
  sourceName: string;
  summary: string[];
  topics: Topic[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  shortQuestions: string[];
  studyPlan: StudySession[];
  examPrep: string[];
  stats: {
    words: number;
    readingMinutes: number;
    topicCount: number;
  };
};
