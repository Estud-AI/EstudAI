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

    if (await prisma.user.findUnique({ where: { email: parsed.data.email } })) {
      await prisma.user.update({
        where: { email: parsed.data.email },
        data: {
          name: parsed.data.name,
        },
      });
      return res.status(201).json({ ok: true });
    }

    await prisma.user.create({
      data: parsed.data,
    });

    return res.status(201).json({ ok: true });
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

    if (await prisma.user.findUnique({ where: { email: parsed.data.email } })) {
      return res
        .status(400)
        .json({ ok: false, error: "User with this email already exists" });
    }

    await prisma.user.create({
      data: parsed.data,
    });

    return res.status(201).json({ ok: true });
  } catch (err: any) {
    console.error("Create user error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to create user" });
  }
});

export default router;
