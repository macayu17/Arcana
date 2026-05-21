export type ProjectStatus = "active" | "completed" | "ongoing";

export type ConceptCategory =
  | "ml"
  | "finance"
  | "web"
  | "systems"
  | "data"
  | "devops"
  | "healthcare";

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ml"
  | "library";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionCategory =
  | "architecture"
  | "code"
  | "concepts"
  | "tradeoffs"
  | "behavioral";

export type FlashcardStatus = "know" | "kinda" | "dont_know";

export interface FlashcardReviewRecord {
  cardId: string;
  projectSlug: string;
  status: FlashcardStatus;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewed: string;
  dueAt: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  repo: string;
  status: ProjectStatus;
  domain: string;
  domainColor: string;
  icon: string;
  architecture: {
    overview: string;
    diagram: string;
    layers: {
      name: string;
      description: string;
      technologies: string[];
    }[];
  };
  techStack: {
    name: string;
    role: string;
    category: TechCategory;
  }[];
  howItWorks: {
    summary: string;
    steps: {
      step: number;
      title: string;
      description: string;
      details?: string;
    }[];
    sequenceDiagram?: string;
  };
  concepts: {
    name: string;
    category: ConceptCategory;
    definition: string;
    explanation: string;
    relevance: string;
  }[];
  codeHighlights: {
    title: string;
    description: string;
    language: string;
    code: string;
    annotations?: string[];
  }[];
  apiDesign?: {
    baseUrl: string;
    endpoints: {
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      path: string;
      description: string;
      requestBody?: string;
      responseBody?: string;
    }[];
  };
  databaseDesign?: {
    type: string;
    diagram?: string;
    tables: {
      name: string;
      description: string;
      fields: string[];
    }[];
  };
  tradeoffs: {
    decision: string;
    chose: string;
    over: string;
    reasoning: string;
  }[];
  challenges: {
    problem: string;
    solution: string;
    lesson: string;
  }[];
  requirements: string[];
  targetAudience: string[];
  futureImprovements: string[];
  interviewQuestions: {
    question: string;
    answer: string;
    difficulty: Difficulty;
    category: QuestionCategory;
  }[];
  flashcards: {
    front: string;
    back: string;
    difficulty: Difficulty;
  }[];
}

export interface ConceptGlossaryEntry {
  name: string;
  category: ConceptCategory;
  definition: string;
  explanation: string;
  usedInProjects: string[];
  relatedConcepts: string[];
}

export interface StudyProgress {
  projectSlug: string;
  sectionsReviewed: string[];
  confidence: Record<string, "low" | "medium" | "high">;
  lastStudied: string;
  flashcardProgress: Record<string, FlashcardStatus>;
}

export interface SearchItem {
  type: "project" | "concept" | "question" | "flashcard";
  title: string;
  content: string;
  slug: string;
  project?: string;
  category?: string;
}

export const PROJECT_SECTION_IDS = [
  "overview",
  "architecture",
  "tech-stack",
  "how-it-works",
  "concepts",
  "code-highlights",
  "api-design",
  "database-design",
  "tradeoffs",
  "challenges",
  "requirements",
  "interview-qa",
] as const;

export type ProjectSectionId = (typeof PROJECT_SECTION_IDS)[number];
