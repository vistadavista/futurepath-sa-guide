import * as React from "react";
import { INTEREST_QUESTIONS } from "@/data/questionnaire";
import type { InterestArea } from "@/data/types";
import { INTEREST_AREAS } from "@/data/types";

export type Role = "Learner" | "Parent" | "Teacher" | "School Admin";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  date: string; // yyyy-mm-dd
  time?: string;
  priority: "High" | "Medium" | "Low";
  category: "Study" | "Application" | "Project" | "Break" | "Personal";
  done: boolean;
  source: "manual" | "ai";
};

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; at: string };

export type ResearchNote = {
  id: string;
  topic: string;
  summary: string;
  keyTerms: { term: string; meaning: string }[];
  studyNotes: string[];
  questions: { question: string; answer: string }[];
  at: string;
};

export type Profile = {
  name: string;
  grade: string;
  school: string;
  province: string;
  subjects: string[];
  about: string;
};

export type AppState = {
  profile: Profile;
  role: Role;
  interestAnswers: Record<string, number>;
  skills: Record<string, number>;
  savedCareers: string[];
  savedInstitutions: string[];
  tasks: Task[];
  chat: ChatMessage[];
  research: ResearchNote[];
  applicationSteps: Record<string, boolean>;
};

const STORAGE_KEY = "futurepath-sa:v1";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function seedTasks(): Task[] {
  return [
    {
      id: "t1",
      title: "Finish Maths exam revision (Chapter 6)",
      date: todayISO(),
      time: "16:00",
      priority: "High",
      category: "Study",
      done: false,
      source: "manual",
      notes: "Trigonometry practice questions 1-15.",
    },
    {
      id: "t2",
      title: "Collect ID copy for NSFAS application",
      date: todayISO(1),
      priority: "High",
      category: "Application",
      done: false,
      source: "manual",
    },
    {
      id: "t3",
      title: "Science project: write method section",
      date: todayISO(2),
      time: "18:00",
      priority: "Medium",
      category: "Project",
      done: false,
      source: "manual",
    },
    {
      id: "t4",
      title: "Read one career profile on FuturePath",
      date: todayISO(),
      priority: "Low",
      category: "Personal",
      done: true,
      source: "manual",
    },
    {
      id: "t5",
      title: "Ask LO teacher about subject change deadline",
      date: todayISO(4),
      priority: "Medium",
      category: "Application",
      done: false,
      source: "manual",
    },
  ];
}

export const DEFAULT_STATE: AppState = {
  profile: {
    name: "Aviwe",
    grade: "Grade 11",
    school: "Sunrise Secondary School",
    province: "Gauteng",
    subjects: ["Mathematics", "Physical Sciences", "Life Sciences", "English", "Life Orientation"],
    about: "Curious about technology and helping people in my community.",
  },
  role: "Learner",
  interestAnswers: {},
  skills: {},
  savedCareers: ["software-developer"],
  savedInstitutions: [],
  tasks: [],
  chat: [],
  research: [],
  applicationSteps: {},
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  update: (fn: (prev: AppState) => AppState) => void;
  reset: () => void;
};

const StoreContext = React.createContext<Ctx | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState({ ...DEFAULT_STATE, ...parsed, profile: { ...DEFAULT_STATE.profile, ...parsed.profile } });
      } else {
        setState({ ...DEFAULT_STATE, tasks: seedTasks() });
      }
    } catch {
      setState({ ...DEFAULT_STATE, tasks: seedTasks() });
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const value = React.useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      update: (fn) => setState((prev) => fn(prev)),
      reset: () => setState({ ...DEFAULT_STATE, tasks: seedTasks() }),
    }),
    [state, hydrated],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

/* ---------- derived helpers ---------- */

export function interestScores(answers: Record<string, number>) {
  const totals: Record<InterestArea, { sum: number; count: number }> = {
    investigative: { sum: 0, count: 0 },
    creative: { sum: 0, count: 0 },
    social: { sum: 0, count: 0 },
    enterprising: { sum: 0, count: 0 },
    practical: { sum: 0, count: 0 },
    organising: { sum: 0, count: 0 },
  };
  for (const q of INTEREST_QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === "number") {
      totals[q.area].sum += v;
      totals[q.area].count += 1;
    }
  }
  return INTEREST_AREAS.map((area) => {
    const t = totals[area.id];
    const score = t.count ? Math.round((t.sum / (t.count * 5)) * 100) : 0;
    return { ...area, score };
  }).sort((a, b) => b.score - a.score);
}

export function progressMetrics(state: AppState) {
  const answered = Object.keys(state.interestAnswers).length;
  const skillsRated = Object.keys(state.skills).length;
  const discovery = Math.round(
    ((answered / INTEREST_QUESTIONS.length) * 0.7 + Math.min(skillsRated / 10, 1) * 0.3) * 100,
  );
  const exploration = Math.min(100, state.savedCareers.length * 25);
  const planSteps = Object.values(state.applicationSteps).filter(Boolean).length;
  const doneTasks = state.tasks.filter((t) => t.done).length;
  const planning = Math.min(100, planSteps * 12 + doneTasks * 8 + state.savedInstitutions.length * 10);
  return { discovery, exploration, planning };
}
