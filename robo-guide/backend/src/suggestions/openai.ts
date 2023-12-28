import * as dotenv from "dotenv";
import { getPrompt } from "./prompt";
import { OpenAI } from "openai";
import { EventEmitter } from "events";

if (process.env.NODE_ENV !== "production") dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4";
const lineStartRE = /.*\n/;

export const getSuggestions = async (target: string, preference?: string) => {
  const prompt = getPrompt(target, preference);
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const stream = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  });

  const emitter = new EventEmitter();

  process.nextTick(async () => {
    let buffer = "";
    for await (const chunk of stream) {
      const payload = chunk.choices[0]?.delta?.content?.replace("\n", "") || "";
      if (payload.includes("[DONE]")) return;
      const match = lineStartRE.exec(payload);
      if (match) {
        emitter.emit("line", buffer + match[0]);
        buffer = payload.slice(match.index + match[0].length);
      } else buffer += payload;
    }
    emitter.emit(buffer);
    emitter.emit("end");
  });
  return emitter;
};
