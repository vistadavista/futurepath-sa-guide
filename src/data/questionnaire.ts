import type { InterestArea } from "./types";

export type InterestQuestion = {
  id: string;
  text: string;
  area: InterestArea;
};

export const INTEREST_QUESTIONS: InterestQuestion[] = [
  { id: "q1", text: "I enjoy figuring out why something works the way it does.", area: "investigative" },
  { id: "q2", text: "I like doing experiments or research projects.", area: "investigative" },
  { id: "q3", text: "Solving a tricky maths or logic problem feels satisfying.", area: "investigative" },
  { id: "q4", text: "I often draw, design, write or make music.", area: "creative" },
  { id: "q5", text: "I like coming up with new ideas nobody has tried.", area: "creative" },
  { id: "q6", text: "I enjoy performing, presenting or telling stories.", area: "creative" },
  { id: "q7", text: "Helping a classmate understand something makes my day.", area: "social" },
  { id: "q8", text: "I care a lot about problems in my community.", area: "social" },
  { id: "q9", text: "People come to me when they need support.", area: "social" },
  { id: "q10", text: "I like leading a group or team project.", area: "enterprising" },
  { id: "q11", text: "I have thought about starting my own business.", area: "enterprising" },
  { id: "q12", text: "I enjoy convincing people of my point of view.", area: "enterprising" },
  { id: "q13", text: "I like fixing or building things with my hands.", area: "practical" },
  { id: "q14", text: "I would rather work outdoors or in a workshop than at a desk.", area: "practical" },
  { id: "q15", text: "I am curious about how machines and tools work.", area: "practical" },
  { id: "q16", text: "I keep my notes, files and schedule neat and in order.", area: "organising" },
  { id: "q17", text: "I enjoy working with numbers, budgets or records.", area: "organising" },
  { id: "q18", text: "I like planning something step by step before starting.", area: "organising" },
];

export const LIKERT = [
  { value: 1, label: "Not me" },
  { value: 2, label: "A little" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Very me" },
];

export type SkillItem = { id: string; label: string; hint: string };

export const SKILLS: SkillItem[] = [
  { id: "communication", label: "Communication", hint: "Explaining ideas clearly in speech and writing" },
  { id: "problem-solving", label: "Problem solving", hint: "Working through a challenge step by step" },
  { id: "numeracy", label: "Working with numbers", hint: "Calculations, data and budgets" },
  { id: "creativity", label: "Creativity", hint: "Coming up with fresh ideas and designs" },
  { id: "teamwork", label: "Teamwork", hint: "Working well with others" },
  { id: "digital", label: "Digital skills", hint: "Computers, apps and online tools" },
  { id: "leadership", label: "Leadership", hint: "Guiding and motivating a group" },
  { id: "practical", label: "Practical hands-on", hint: "Building, fixing and using tools" },
  { id: "organisation", label: "Organisation", hint: "Planning time and keeping track" },
  { id: "resilience", label: "Resilience", hint: "Keeping going when things get hard" },
];

export const QUICK_CHAT_PROMPTS = [
  "Which subjects do I need to become an engineer in South Africa?",
  "Explain photosynthesis like I'm in Grade 9.",
  "How do I apply for NSFAS step by step?",
  "Help me prepare for my Maths exam next week.",
  "What can I study if I like art and business?",
  "What is the difference between a TVET college and a university?",
];

export const AI_DISCLAIMER =
  "AI can make mistakes. Use these answers as a starting point and always check important details with your teacher, Life Orientation guide or the official institution website.";
