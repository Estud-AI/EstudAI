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
      include: { summaries: true },
    });

    if (!subject) {
      return res.status(404).json({ ok: false, error: "Subject not found." });
    }

    const prompt = getPrompt(
      "summary",
      subject.name || ""
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

    if (!parsed || !parsed.summary) {
      return res.status(500).json({ ok: false, error: "Unexpected AI response format.", result: parsed });
    }

    // Extrair conteúdo do resumo da estrutura correta
    const summaryData = parsed.summary;
    const resumoTexto = JSON.stringify(summaryData, null, 2); // Convert the structured summary to formatted text
    const resumoTitulo = `Resumo - ${subject.name}`;

    if (!summaryData || Object.keys(summaryData).length === 0) {
      return res.status(200).json({ ok: true, created: null, message: "No valid content returned by AI." });
    }

    const newSummary = await prisma.summary.create({
      data: {
        text: resumoTexto.trim(),
        name: resumoTitulo.trim(),
        subjectId: subjectId,
      },
      include: {
        subject: true
      }
    });

    return res.status(201).json({ 
      ok: true, 
      created: newSummary,
      tema: subject.name
    });
  } catch (err: any) {
    console.error("Create summary error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to create summary" });
  }
});

export default router;