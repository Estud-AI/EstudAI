const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY não configurada");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
