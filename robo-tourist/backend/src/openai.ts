import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { splitResponse } from "./utils";

if (process.env.NODE_ENV !== "production") dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export const getSuggestions = async (target: string, preference?: string) => {
  const prompt = `I'm visiting ${target} ${
    preference && preference.length > 3 ? "and i like " + preference : ""
  }. Give me 10 recommendations on places to visit and why i should visit each.`;
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (response.ok) {
    const message = (await response.json()).choices[0].message.content;
    if (message) return splitResponse(message as string);
    else throw new Error("Invalid response");
  } else throw new Error(`OpenAI returns status ${response.status}`);
};
