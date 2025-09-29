const { openai } = require("../lib/openai");

type AskOptions = {
  prompt: string;
  system?: string;
  model?: string;
  temperature?: number;
};

export async function askAI({
  prompt,
  system = "Você é um assistente útil e objetivo.",
  model = "gpt-4o-mini",
  temperature = 0.2,
}: AskOptions) {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    temperature,
  });

  const text = response.choices[0]?.message?.content || "";
  return { text };
}
