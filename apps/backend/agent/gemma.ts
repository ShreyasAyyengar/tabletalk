import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { config } from "dotenv";
config({ path: ".env.local" });

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const tools = [
  {
    type: "function" as const,
    function: {
      name: "check_availability",
      description: "Check if tables are available for a given date, time, and party size",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date like 2026-07-26" },
          time: { type: "string", description: "24h time like 19:00" },
          party_size: { type: "number", description: "Number of guests" },
        },
        required: ["date", "time", "party_size"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_reservation",
      description: "Book a table once availability is confirmed",
      parameters: {
        type: "object",
        properties: {
          customer: { type: "string" },
          party_size: { type: "number" },
          time: { type: "string" },
          notes: { type: "string", description: "Preferences like quiet, window seat, occasion" },
        },
        required: ["customer", "party_size", "time"],
      },
    },
  },
];

const toolImpls: Record<string, (args: any) => Promise<any>> = {
  check_availability: async (args) => await convex.query(api.reservations.checkAvailability, args),
  create_reservation: async (args) => await convex.mutation(api.reservations.createReservation, args),
};

export async function runAgent(userMessage: string): Promise<string> {
  const today = new Date().toISOString().split("T")[0];

  const messages: any[] = [
    {
      role: "system",
      content: `You are a restaurant host. Today is ${today}. Use the tools to check availability and book reservations. Confirm details before booking.`,
    },
    { role: "user", content: userMessage },
  ];

  for (let step = 0; step < 5; step++) {
    const res = await fetch("http://localhost:11434/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemma4:12b", messages, tools }),
    });
    const data = await res.json() as any;
    const msg = data.choices[0].message;
    messages.push(msg);

    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      return msg.content ?? "";
    }

    for (const call of msg.tool_calls) {
      const args = JSON.parse(call.function.arguments);
      const impl = toolImpls[call.function.name];
      if (!impl) continue;
      const result = await impl(args);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  return "Sorry, I couldn't complete that.";
}