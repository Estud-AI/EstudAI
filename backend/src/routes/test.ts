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
      return res.status(400).json({ ok: false, error: "Campo 'userId' é obrigatório e deve ser um número." });
    }

    if (!subjectId || typeof subjectId !== "number") {
      return res.status(400).json({ ok: false, error: "Campo 'subjectId' é obrigatório e deve ser um número." });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { tests: true },
    });

    if (!subject) {
      return res.status(404).json({ ok: false, error: "Subject não encontrada." });
    }

    const prompt = getPrompt(
      "test",
      subject.name || ""
    );

    const aiResult = await askAI({ prompt, model: undefined, temperature: 0.2 });

    let parsed: any = aiResult;
    if (aiResult.text && typeof aiResult.text === "string") {
      try {
        const clean = aiResult.text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        parsed = JSON.parse(clean);
      } catch (parseErr) {
        return res.status(500).json({ ok: false, error: "Não foi possível parsear a resposta da AI.", aiText: aiResult.text });
      }
    }

    if (!parsed || !Array.isArray(parsed.simulado)) {
      return res.status(500).json({ ok: false, error: "Formato inesperado da resposta da AI.", result: parsed });
    }

    const toSave = [] as Array<{
      quest: string;
      a1: string;
      a2: string;
      a3: string;
      a4: string;
      correctAnswer: number;
    }>;

    for (const question of parsed.simulado) {
      if (!question || !question.questao || !question.A || !question.B || !question.C || !question.D || !question.resposta_correta) {
        continue;
      }

      // Convert correct answer letter to number (A=1, B=2, C=3, D=4)
      let correctAnswer = 1;
      const correctLetter = question.resposta_correta.toUpperCase().trim();
      switch (correctLetter) {
        case 'A': correctAnswer = 1; break;
        case 'B': correctAnswer = 2; break;
        case 'C': correctAnswer = 3; break;
        case 'D': correctAnswer = 4; break;
        default: correctAnswer = 1; // fallback to A if invalid
      }

      toSave.push({
        quest: question.questao.trim(),
        a1: question.A.trim(),
        a2: question.B.trim(),
        a3: question.C.trim(),
        a4: question.D.trim(),
        correctAnswer: correctAnswer,
      });

      if (toSave.length >= 10) break; // Limit to 10 questions
    }

    if (toSave.length === 0) {
      return res.status(200).json({ ok: true, created: null, message: "Nenhuma questão válida retornada pela AI." });
    }

    // Create the test first
    const newTest = await prisma.test.create({
      data: {
        name: `Simulado - ${subject.name}`,
        subjectId: subjectId,
      },
    });

    // Create all questions for this test
    const createdQuestions = [];
    for (const question of toSave) {
      const createdQuestion = await prisma.questions.create({
        data: {
          testId: newTest.id,
          quest: question.quest,
          a1: question.a1,
          a2: question.a2,
          a3: question.a3,
          a4: question.a4,
          correctAnswer: question.correctAnswer,
        },
      });
      createdQuestions.push(createdQuestion);
    }

    // Return the test with questions
    const testWithQuestions = await prisma.test.findUnique({
      where: { id: newTest.id },
      include: {
        questions: true,
        subject: true
      }
    });

    return res.status(201).json({ 
      ok: true, 
      created: testWithQuestions,
      tema: subject.name
    });
  } catch (err: any) {
    console.error("Create test error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to create test" });
  }
});

export default router;