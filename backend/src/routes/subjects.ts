const express = require("express");
const { askAI } = require("../ai/ask");
const { getPrompt } = require("../prompts/prompts");
const prisma = require("../lib/prisma").default;
import type { Request, Response } from 'express';

const router = express.Router();

// Função auxiliar para converter letras em números (A=1, B=2, C=3, D=4)
function letterToNumber(letter: string): number {
  const map: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
  return map[letter.toUpperCase()] || 1;
}

// Função auxiliar para determinar o nível baseado na posição da questão
function getQuestionLevel(index: number): 'EASY' | 'MEDIUM' | 'HARD' {
  if (index < 3) return 'EASY';        // Primeiras 3 questões: EASY
  if (index < 7) return 'MEDIUM';      // Próximas 4 questões: MEDIUM  
  return 'HARD';                       // Últimas 3 questões: HARD
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { tema, userId } = req.body || {};
    
    if (!tema || typeof tema !== "string") {
      return res.status(400).json({ error: "Field 'tema' is required." });
    }

    if (!userId || typeof userId !== "number") {
      return res.status(400).json({ error: "Field 'userId' is required." });
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Gerar o prompt para matéria completa
    const prompt = getPrompt('subject', tema);
    
    // Solicitar à IA o conteúdo da matéria
    const aiResult = await askAI({ 
      prompt, 
      system: "Você é um assistente educacional especializado em criar materiais de estudos completos.",
      model: "gpt-4o-mini",
      temperature: 0.2 
    });

    // Fazer parse do resultado JSON
    let parsedContent;
    try {
      const cleanText = aiResult.text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      parsedContent = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      return res.status(500).json({ 
        error: "Erro ao processar conteúdo da IA.",
        details: process.env.NODE_ENV === "development" ? String(parseError) : undefined
      });
    }

    // Iniciar transação do banco
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Criar o Subject
      const subject = await tx.subject.create({
        data: {
          name: tema,
          userId: userId,
          progress: 0
        }
      });

      // 2. Criar o Summary
      const summaryText = JSON.stringify(parsedContent.summary);
      const summary = await tx.summary.create({
        data: {
          name: `Resumo: ${tema}`,
          text: summaryText,
          subjectId: subject.id
        }
      });

      // 3. Criar o Test
      const test = await tx.test.create({
        data: {
          name: `Simulado: ${tema}`,
          subjectId: subject.id,
          attempts: 0,
          accurateAnswers: 0
        }
      });

      // 4. Criar as Questions
      const questions = await Promise.all(
        parsedContent.simulado.map(async (q: any, index: number) => {
          return tx.questions.create({
            data: {
              testId: test.id,
              question: q.questao,
              option1: q.A,
              option2: q.B,
              option3: q.C,
              option4: q.D,
              correctAnswer: letterToNumber(q.resposta_correta)
            }
          });
        })
      );

      // 5. Criar os Flashcards
      const flashcards = await Promise.all(
        parsedContent.flashcards.map(async (card: any, index: number) => {
          return tx.flashcard.create({
            data: {
              front: card.frente,
              back: card.verso,
              level: getQuestionLevel(index),
              subjectId: subject.id
            }
          });
        })
      );

      return {
        subject,
        summary,
        test,
        questions,
        flashcards,
        totalItems: {
          questions: questions.length,
          flashcards: flashcards.length
        }
      };
    });

    return res.json({
      ok: true,
      message: "Matéria criada com sucesso!",
      data: {
        subjectId: result.subject.id,
        subjectName: result.subject.name,
        summaryId: result.summary.id,
        testId: result.test.id,
        totalQuestions: result.totalItems.questions,
        totalFlashcards: result.totalItems.flashcards
      }
    });

  } catch (err: any) {
    console.error("Subjects creation error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Falha ao criar a matéria.",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

// Endpoint para listar matérias de um usuário
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      return res.status(400).json({ error: "userId inválido." });
    }

    const subjects = await prisma.subject.findMany({
      where: { userId },
      include: {
        summaries: true,
        tests: {
          include: {
            questions: true
          }
        },
        flashcards: true,
        _count: {
          select: {
            summaries: true,
            tests: true,
            flashcards: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      ok: true,
      subjects
    });

  } catch (err: any) {
    console.error("Get subjects error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Falha ao buscar matérias.",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

// Endpoint para buscar uma matéria específica com todos os dados
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const subjectId = parseInt(req.params.id);

    if (!subjectId) {
      return res.status(400).json({ error: "ID da matéria inválido." });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        summaries: true,
        tests: {
          include: {
            questions: true
          }
        },
        flashcards: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    return res.json({
      ok: true,
      subject
    });

  } catch (err: any) {
    console.error("Get subject error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Falha ao buscar matéria.",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

// Endpoint para deletar uma matéria
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const subjectId = parseInt(req.params.id);

    if (!subjectId) {
      return res.status(400).json({ error: "ID da matéria inválido." });
    }

    // Verificar se a matéria existe
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ error: "Matéria não encontrada." });
    }

    // Deletar em uma transação para garantir consistência
    await prisma.$transaction(async (tx: any) => {
      // 1. Buscar todos os testes da matéria para deletar suas questões
      const tests = await tx.test.findMany({
        where: { subjectId },
        select: { id: true }
      });

      // 2. Deletar todas as questões dos testes
      for (const test of tests) {
        await tx.questions.deleteMany({
          where: { testId: test.id }
        });
      }

      // 3. Deletar todos os testes
      await tx.test.deleteMany({
        where: { subjectId }
      });

      // 4. Deletar todos os flashcards
      await tx.flashcard.deleteMany({
        where: { subjectId }
      });

      // 5. Deletar todos os resumos
      await tx.summary.deleteMany({
        where: { subjectId }
      });

      // 6. Finalmente, deletar a matéria
      await tx.subject.delete({
        where: { id: subjectId }
      });
    });

    return res.json({
      ok: true,
      message: "Matéria deletada com sucesso."
    });

  } catch (err: any) {
    console.error("Delete subject error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Falha ao deletar matéria.",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

export default router;