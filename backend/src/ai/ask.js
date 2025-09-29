const { openai } = require("../lib/openai");

async function askAI({
  prompt,
  system = "Você é um assistente útil e objetivo.",
  model = "gpt-4o-mini",
  temperature = 0.2,
}) {
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

module.exports = { askAI };