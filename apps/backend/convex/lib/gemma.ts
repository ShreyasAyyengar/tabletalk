import { OpenAI } from "openai";

export const foo = async () => {
  const client = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "unused",
  });

  const response = await client.chat.completions.create({
    model: "gemma:12b",
    messages: [{ role: "user", content: "Hello" }],
  });

  return response.choices[0].message.content;
};
