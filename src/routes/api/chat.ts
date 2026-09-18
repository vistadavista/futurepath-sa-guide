import { createFileRoute } from "@tanstack/react-router";
import { AiError, readAiStream, startAiStream } from "@/lib/ai.server";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are the FuturePath SA chatbot, a warm, encouraging study and career buddy for South African high school learners. " +
  "Answer in clear, simple English with South African context (CAPS subjects, NSC, NSFAS, TVET colleges, SETA learnerships, universities). " +
  "Keep answers under 200 words, use short paragraphs or bullets, and end with one helpful next step. " +
  "Never invent deadlines, fees or admission points - tell the learner to confirm on the official website or with their Life Orientation teacher.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: Msg[] };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
        if (messages.length === 0) return new Response("Messages are required", { status: 400 });

        const transcript = messages
          .map((m) => `${m.role === "user" ? "Learner" : "FuturePath"}: ${m.content}`)
          .join("\n\n");

        try {
          const upstream = await startAiStream({ system: SYSTEM, input: transcript });
          const stream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              try {
                await readAiStream(upstream, (delta) => controller.enqueue(encoder.encode(delta)));
                controller.close();
              } catch (error) {
                controller.error(error);
              }
            },
          });
          return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
          });
        } catch (error) {
          const status = error instanceof AiError ? error.status : 500;
          const message =
            error instanceof Error ? error.message : "The AI could not answer right now.";
          return new Response(message, { status: status >= 400 ? status : 500 });
        }
      },
    },
  },
});
