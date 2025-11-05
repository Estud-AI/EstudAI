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

export default router;
