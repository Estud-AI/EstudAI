const express = require("express");
import type { Request, Response } from "express";

const { getPrompt } = require("../prompts/prompts");
const { askAI } = require("../ai/ask");
const prisma = require("../lib/prisma").default;

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, subjectId } = req.body || {};

    if (!userId || typeof userId !== "number") {
      return res.status(400).json({ ok: false, error: "Field 'userId' is required and must be a number." });
    }

    if (!subjectId || typeof subjectId !== "number") {
      return res.status(400).json({ ok: false, error: "Field 'subjectId' is required and must be a number." });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { flashcards: true },
    });

    if (!subject) {
      return res.status(404).json({ ok: false, error: "Subject not found." });
    }

    const existingFronts = (subject.flashcards || []).map((f: any) => f.front?.trim()).filter(Boolean);

    const prompt = getPrompt(
      "flashcards",
      subject.name || "",
      { existing_fronts: existingFronts.join("\n") }
    );

    const aiResult = await askAI({ prompt, model: undefined, temperature: 0.2 });

    let parsed: any = aiResult;
    if (aiResult.text && typeof aiResult.text === "string") {
      try {
        const clean = aiResult.text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        parsed = JSON.parse(clean);
      } catch (parseErr) {
        return res.status(500).json({ ok: false, error: "Could not parse AI response.", aiText: aiResult.text });
      }
    }

    if (!parsed || !Array.isArray(parsed.flashcards)) {
      return res.status(500).json({ ok: false, error: "Unexpected AI response format.", result: parsed });
    }

    const toSave = [] as Array<{ front: string; back: string; level: string }>;
    for (const fc of parsed.flashcards) {
      if (!fc || !fc.frente || !fc.verso) continue;
      const rawLevel = (fc.level || '').toString().trim().toUpperCase();
      const level = ['EASY', 'MEDIUM', 'HARD'].includes(rawLevel) ? rawLevel : 'MEDIUM';
      toSave.push({ front: fc.frente.trim(), back: fc.verso.trim(), level });
      if (toSave.length >= 5) break;
    }

    if (toSave.length === 0) {
      return res.status(200).json({ ok: true, created: [], message: "No valid flashcards returned by AI." });
    }

    const created: any[] = [];
    for (const nf of toSave) {
      const createdFc = await prisma.flashcard.create({
        data: {
          front: nf.front,
          back: nf.back,
          level: nf.level,
          subjectId: subjectId,
        },
      });
      created.push(createdFc);
    }

    return res.status(201).json({ ok: true, created, duplicatedReported: parsed.duplicatas || [] });
  } catch (err: any) {
    console.error("Create flashcards error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to create flashcards" });
  }
});

export default router;
