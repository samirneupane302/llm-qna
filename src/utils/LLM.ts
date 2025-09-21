import OpenAI from "openai";
import { PROMT_EXAMPLE } from "./promts";
import type { IContext } from "../types/types.interface";
import { OPENAI_API_KEY } from "../constant";

const openAI = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const SearchLLM = async (question: string, context: IContext[]) => {
  const completion = await openAI.chat.completions.create({
    model: "openai/gpt-4o-mini",
    max_tokens: 1000,
    temperature: 0.5,
    messages: [
      {
        role: "assistant",
        content: PROMT_EXAMPLE,
      },
      {
        role: "assistant",
        content: JSON.stringify({ type: "context", data: context }),
      },
      {
        role: "user",
        content: JSON.stringify({
          type: "question",
          data: question,
        }),
      },
    ],
  });
  if (completion.choices && completion.choices.length > 0) {
    return completion.choices[0].message.content;
  }
  //@ts-ignore;
  return null;
};
