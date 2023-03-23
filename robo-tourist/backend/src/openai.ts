import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { splitResponse } from "./utils";

if (process.env.NODE_ENV !== "production") dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MAX_TARGET_LENGTH = 20;
const MAX_PREF_LENGTH = 70;

export const getSuggestions = async (target: string, preference?: string) => {
  if (!target)
    throw new Error("Input Error! Target parameter must be provided.");
  if (target.length > MAX_TARGET_LENGTH)
    throw new Error("Input Error! Target name exceed maximum length.");
  if (preference && preference.length > MAX_PREF_LENGTH)
    throw new Error("Input Error! Preference exceed maximum length.");

  const prompt = `I'm visiting ${target} ${
    preference && preference.length > 3
      ? "and I'm looking for " + preference
      : ""
  }. Give me 10 recommendations on places to visit and why i should visit each one.`;
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
  if (!response.ok)
    throw `Error accessing GPT-3! Status code: ${response.status}.`;
  const message = (await response.json()).choices[0].message.content;
  if (message) return splitResponse(message as string);
  else throw new Error("Error processing GPT-3 response!");
};
