/**
 * Server-only helpers for calling the Lovable AI Gateway Responses API.
 * Every call streams; buffered calls time out on reasoning models.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
export const AI_MODEL = "openai/gpt-6-astra";

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function friendlyAiMessage(status: number, fallback: string) {
  if (status === 429) return "The AI is busy right now. Please wait a moment and try again.";
  if (status === 402)
    return "The AI credits for this app have run out. Ask the app owner to top up to keep using AI tools.";
  if (status === 403) return "AI features are currently switched off for this app.";
  if (status === 401 || status === 500) return "The AI service is not set up correctly right now.";
  return fallback || "Something went wrong while talking to the AI.";
}

function apiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError(401, "Missing LOVABLE_API_KEY");
  return key;
}

type CallOptions = {
  system?: string;
  input: string;
  jsonSchema?: { name: string; schema: Record<string, unknown> };
};

/** Starts a streaming Responses request and returns the raw SSE response. */
export async function startAiStream(options: CallOptions): Promise<Response> {
  const body: Record<string, unknown> = {
    model: AI_MODEL,
    input: options.system
      ? [
          { role: "developer", content: [{ type: "input_text", text: options.system }] },
          { role: "user", content: [{ type: "input_text", text: options.input }] },
        ]
      : options.input,
    stream: true,
    store: false,
    reasoning: { effort: "low", summary: "auto" },
  };
  if (options.jsonSchema) {
    body["text"] = {
      format: {
        type: "json_schema",
        name: options.jsonSchema.name,
        strict: true,
        schema: options.jsonSchema.schema,
      },
    };
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey(),
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new AiError(res.status, friendlyAiMessage(res.status, text.slice(0, 300)));
  }
  return res;
}

/** Reads an SSE stream and calls onDelta for each output text fragment. */
export async function readAiStream(res: Response, onDelta?: (delta: string) => void) {
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let text = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && event.delta) {
          text += event.delta;
          onDelta?.(event.delta);
        } else if (event.type === "response.completed" && !text && event.response?.output_text) {
          text = event.response.output_text;
          onDelta?.(text);
        }
      } catch {
        /* ignore malformed event */
      }
    }
  }
  return text;
}

export async function generateAiText(options: CallOptions) {
  const res = await startAiStream(options);
  return readAiStream(res);
}

export async function generateAiJson<T>(options: CallOptions): Promise<T> {
  const text = await generateAiText(options);
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  return JSON.parse(cleaned) as T;
}
