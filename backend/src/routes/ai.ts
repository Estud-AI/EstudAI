const express = require("express");
const { askAI } = require("../ai/ask");
import type { Request, Response } from 'express';

const router = express.Router();

router.post("/ask", async (req: Request, res: Response) => {
  try {
    const { prompt, system, model, temperature } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Field 'prompt' is required." });
    }

    const result = await askAI({ prompt, system, model, temperature });
    
    let parsedResult = result;
    if (result.text && typeof result.text === 'string') {
      try {
        const cleanText = result.text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const jsonData = JSON.parse(cleanText);
        parsedResult = jsonData;
      } catch (parseError) {
        parsedResult = result;
      }
    }
    
    return res.json({ ok: true, result: parsedResult });
  } catch (err: any) {
    console.error("AI error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Failed to query AI model.",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

export default router;