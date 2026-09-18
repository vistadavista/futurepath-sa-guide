import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AiError, friendlyAiMessage, generateAiJson } from "./ai.server";

const TUTOR_CONTEXT =
  "You are FuturePath SA, a friendly study and career assistant for South African high school learners. " +
  "Use clear, simple English, South African context (CAPS curriculum, NSC subjects, NSFAS, TVET colleges, SETA learnerships) and an encouraging tone. " +
  "Never invent specific application deadlines or fees; tell the learner to confirm on the official website.";

/* ---------------- Research assistant ---------------- */

const ResearchInput = z.object({
  topic: z.string().min(3).max(6000),
});

const researchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    keyTerms: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { term: { type: "string" }, meaning: { type: "string" } },
        required: ["term", "meaning"],
      },
    },
    studyNotes: { type: "array", items: { type: "string" } },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
  },
  required: ["summary", "keyTerms", "studyNotes", "questions"],
} as const;

const ResearchResult = z.object({
  summary: z.string(),
  keyTerms: z.array(z.object({ term: z.string(), meaning: z.string() })),
  studyNotes: z.array(z.string()),
  questions: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const raw = await generateAiJson<unknown>({
        system:
          TUTOR_CONTEXT +
          " Produce study material from the learner's topic or pasted article. Keep the summary under 180 words, give 4-6 key terms, 5-7 short study notes and 4-6 revision questions with short answers.",
        input: data.topic,
        jsonSchema: { name: "study_pack", schema: researchSchema as unknown as Record<string, unknown> },
      });
      return ResearchResult.parse(raw);
    } catch (error) {
      if (error instanceof AiError) throw new Error(error.message);
      throw new Error(friendlyAiMessage(0, "The AI could not build study notes for that. Try rephrasing your topic."));
    }
  });

/* ---------------- Task planner ---------------- */

const PlannerInput = z.object({
  goals: z.string().min(3).max(2000),
  horizon: z.enum(["day", "week"]),
  startDate: z.string(),
});

const plannerSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overview: { type: "string" },
    tasks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          notes: { type: "string" },
          date: { type: "string", description: "yyyy-mm-dd" },
          time: { type: "string", description: "HH:MM 24 hour" },
          priority: { type: "string", enum: ["High", "Medium", "Low"] },
          category: { type: "string", enum: ["Study", "Application", "Project", "Break", "Personal"] },
        },
        required: ["title", "notes", "date", "time", "priority", "category"],
      },
    },
  },
  required: ["overview", "tasks"],
} as const;

const PlannerResult = z.object({
  overview: z.string(),
  tasks: z.array(
    z.object({
      title: z.string(),
      notes: z.string(),
      date: z.string(),
      time: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      category: z.enum(["Study", "Application", "Project", "Break", "Personal"]),
    }),
  ),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const span = data.horizon === "day" ? "a single study day" : "the next 7 days";
    try {
      const raw = await generateAiJson<unknown>({
        system:
          TUTOR_CONTEXT +
          ` Turn the learner's goals into a realistic schedule for ${span}, starting on ${data.startDate}. ` +
          "Study blocks are 30-60 minutes with short Break tasks between them, after school hours on weekdays. " +
          "Return 6-12 tasks in total, each with a date between " +
          data.startDate +
          " and the end of the period, a 24-hour time, a priority and a category.",
        input: data.goals,
        jsonSchema: { name: "study_plan", schema: plannerSchema as unknown as Record<string, unknown> },
      });
      return PlannerResult.parse(raw);
    } catch (error) {
      if (error instanceof AiError) throw new Error(error.message);
      throw new Error("The AI could not build a schedule from that. Try describing your goals in a sentence or two.");
    }
  });
