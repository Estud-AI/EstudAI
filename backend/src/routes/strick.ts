import express from "express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma";

const router = express.Router();

router.post("/update-streak", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "number") {
      return res.status(400).json({
        ok: false,
        error: "Field 'userId' is required and must be a number.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    let newStreak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastDayStreak) {
      const lastStreakDate = new Date(user.lastDayStreak);
      lastStreakDate.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - lastStreakDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Já foi atualizado hoje, não fazer nada
        return res.status(200).json({ 
          ok: true, 
          user,
          message: "Streak already updated today" 
        });
      } 
      
      if (diffDays === 1) {
        // Dia consecutivo, incrementar streak
        newStreak = (user.dayStreak || 0) + 1;
      }
      // Se diffDays > 1, newStreak já é 1 (resetado)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        dayStreak: newStreak, 
        lastDayStreak: new Date() 
      },
    });

    return res.status(200).json({ ok: true, user: updatedUser });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Update streak error:", errorMessage);
    return res.status(500).json({ 
      ok: false, 
      error: "Failed to update streak" 
    });
  }
});

export default router;