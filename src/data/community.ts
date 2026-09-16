import type { Achievement, Announcement, SchoolEvent } from "./types";

export const SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: "ev1",
    title: "Grade 10-12 Career Day",
    type: "Career Day",
    date: "2026-09-25",
    location: "School hall",
    description: "Over 20 employers and colleges with stands, talks and Q&A sessions.",
  },
  {
    id: "ev2",
    title: "University of Pretoria campus visit",
    type: "University Visit",
    date: "2026-10-03",
    location: "Hatfield Campus (bus leaves 06:30)",
    description: "Faculty tours, residence walk-through and an application help desk.",
  },
  {
    id: "ev3",
    title: "NSFAS application workshop",
    type: "Workshop",
    date: "2026-10-10",
    location: "Computer lab",
    description: "Bring your ID and proof of income - we apply together, step by step.",
  },
  {
    id: "ev4",
    title: "UCT undergraduate applications close",
    type: "Deadline",
    date: "2026-07-31",
    location: "Online",
    description: "Late applications are seldom accepted - submit early.",
  },
  {
    id: "ev5",
    title: "Coding & robotics taster session",
    type: "Workshop",
    date: "2026-09-30",
    location: "Lab 2",
    description: "Build your first mini app with mentors from a local tech company.",
  },
  {
    id: "ev6",
    title: "Funza Lushaka bursary info session",
    type: "Workshop",
    date: "2026-11-05",
    location: "Library",
    description: "For learners considering teaching - what the bursary covers and how to apply.",
  },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "an1",
    title: "Term 3 exam timetable released",
    from: "Deputy Principal",
    date: "2026-09-14",
    body: "Timetables are on the notice board and in your class group. Study plans start now - use the AI Task Planner to build yours.",
  },
  {
    id: "an2",
    title: "Subject change window closes 30 September",
    from: "Grade Head",
    date: "2026-09-12",
    body: "If your career pathway needs different subjects, speak to the Life Orientation teacher before the window closes.",
  },
  {
    id: "an3",
    title: "Free Saturday Maths classes",
    from: "Maths Department",
    date: "2026-09-08",
    body: "Every Saturday 09:00-11:00 in Room 12. Open to Grade 10-12. Bring your textbook.",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ac1",
    learner: "Lerato Mokoena",
    grade: "Grade 12",
    title: "Accepted into BEng Civil Engineering",
    description: "Conditional offer from the University of Pretoria with an Eskom bursary interview.",
  },
  {
    id: "ac2",
    learner: "Sipho Dlamini",
    grade: "Grade 11",
    title: "Winner - Provincial Science Expo",
    description: "Built a low-cost water filter for community boreholes.",
  },
  {
    id: "ac3",
    learner: "Aisha Patel",
    grade: "Grade 12",
    title: "Funza Lushaka bursary recipient",
    description: "Will study BEd Foundation Phase at North-West University.",
  },
  {
    id: "ac4",
    learner: "Thabo Nkosi",
    grade: "Grade 10",
    title: "Junior Coding Challenge finalist",
    description: "Top 10 nationally in the schools app-building challenge.",
  },
];
