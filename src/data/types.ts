export type InterestArea =
  | "investigative"
  | "creative"
  | "social"
  | "enterprising"
  | "practical"
  | "organising";

export const INTEREST_AREAS: { id: InterestArea; label: string; blurb: string }[] = [
  {
    id: "investigative",
    label: "Investigating & Analysing",
    blurb: "Asking questions, experimenting, solving puzzles with data and science.",
  },
  {
    id: "creative",
    label: "Creating & Designing",
    blurb: "Making, designing, performing and telling stories.",
  },
  {
    id: "social",
    label: "Helping & Teaching",
    blurb: "Caring for people, teaching, healing and building communities.",
  },
  {
    id: "enterprising",
    label: "Leading & Business",
    blurb: "Starting things, persuading, selling and leading teams.",
  },
  {
    id: "practical",
    label: "Building & Hands-on",
    blurb: "Fixing, building, working with tools, machines and the outdoors.",
  },
  {
    id: "organising",
    label: "Organising & Detail",
    blurb: "Planning, keeping records, numbers and making systems work.",
  },
];

export type Career = {
  id: string;
  title: string;
  field: string;
  summary: string;
  interests: InterestArea[];
  subjects: string[];
  minLevel: "Certificate" | "Diploma" | "Degree" | "Artisan trade";
  qualifications: string[];
  institutions: string[];
  pathway: string[];
  salaryRange: string;
  demand: "High" | "Growing" | "Steady";
  dayInLife: string;
};

export type Institution = {
  id: string;
  name: string;
  type: "University" | "TVET College" | "University of Technology";
  province: string;
  city: string;
  popularFields: string[];
  applicationWindow: string;
  fees: string;
  blurb: string;
};

export type Qualification = {
  id: string;
  name: string;
  nqf: number;
  duration: string;
  offeredBy: string[];
  requirements: string;
  leadsTo: string[];
};

export type Programme = {
  id: string;
  name: string;
  host: string;
  type: "Learnership" | "Apprenticeship";
  field: string;
  duration: string;
  stipend: string;
  requirements: string;
  closingDate: string;
};

export type Bursary = {
  id: string;
  name: string;
  provider: string;
  covers: string;
  fields: string[];
  requirements: string;
  closingDate: string;
  link: string;
};

export type SchoolEvent = {
  id: string;
  title: string;
  type: "Career Day" | "University Visit" | "Workshop" | "Deadline";
  date: string;
  location: string;
  description: string;
};

export type Announcement = {
  id: string;
  title: string;
  from: string;
  date: string;
  body: string;
};

export type Achievement = {
  id: string;
  learner: string;
  grade: string;
  title: string;
  description: string;
};
