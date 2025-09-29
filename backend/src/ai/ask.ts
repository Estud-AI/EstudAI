import { openai } from "../lib/openai";

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
  const response = await openai.responses.create({
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    temperature,
  });

  if (response.output_text) return { text: (response as any).output_text };

  const text =
    response.output
      ?.map((item: any) =>
        item?.content
          ?.map((c: any) =>
            c?.text?.value ?? c?.output_text?.value ?? ""
          )
          .join("")
      )
      .join("") ?? "";

  return { text };
}
