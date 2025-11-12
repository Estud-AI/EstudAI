const express = require("express");
import type { Request, Response } from "express";
import UserSchema from "../schemas/user";
import prisma from "../lib/prisma";

const router = express.Router();

router.post("/user-register-by-google", async (req: Request, res: Response) => {
  try {
    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map(err => err.message);
      return res.status(400).json({ ok: false, error: messages });
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ 
      where: { email: parsed.data.email } 
    });

    if (existingUser) {
      // Atualizar o usuário existente
      const updatedUser = await prisma.user.update({
        where: { email: parsed.data.email },
        data: {
          name: parsed.data.name,
        },
      });
      return res.status(200).json({ ok: true, user: updatedUser });
    }

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: parsed.data,
    });

    return res.status(201).json({ ok: true, user: newUser });
  } catch (err: any) {
    console.error("Create user error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to create user" });
  }
});

router.post("/user-register", async (req: Request, res: Response) => {
  try {
    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map(err => err.message);
      return res.status(400).json({ ok: false, error: messages });
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ 
      where: { email: parsed.data.email } 
    });

    if (existingUser) {
      return res.status(200).json({ ok: true, user: existingUser });
    }

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: parsed.data,
    });

    return res.status(201).json({ ok: true, user: newUser });
  } catch (err: any) {
    console.error("Create user error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to create user" });
  }
});

// Buscar usuário por email
router.get("/user-by-email/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ ok: false, error: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    return res.status(200).json({ ok: true, user });
  } catch (err: any) {
    console.error("Get user error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to get user" });
  }
});

// Buscar perfil completo do usuário com estatísticas
router.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ ok: false, error: "User ID is required" });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ ok: false, error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subjects: {
          include: {
            flashcards: true,
            tests: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    // Calcular estatísticas
    const totalSubjects = user.subjects.length;
    const totalFlashcards = user.subjects.reduce((acc, subject) => acc + subject.flashcards.length, 0);
    
    // Calcular total de quizzes completados (soma dos attemps de todos os testes)
    const quizzesCompleted = user.subjects.reduce((acc, subject) => {
      return acc + subject.tests.reduce((testAcc, test) => testAcc + test.attemps, 0);
    }, 0);

    const profile = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dayStreak: user.dayStreak,
      joinedDate: user.createdAt,
      stats: {
        subjects: totalSubjects,
        flashcards: totalFlashcards,
        quizzesCompleted: quizzesCompleted,
      }
    };

    return res.status(200).json({ ok: true, profile });
  } catch (err: any) {
    console.error("Get profile error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to get user profile" });
  }
});

// Atualizar perfil do usuário
router.put("/profile/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, error: "User ID is required" });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ ok: false, error: "Invalid user ID" });
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return res.status(200).json({ 
      ok: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        dayStreak: updatedUser.dayStreak,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (err: any) {
    console.error("Update profile error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to update profile" });
  }
});

export default router;
