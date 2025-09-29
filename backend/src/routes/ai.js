const express = require("express");
const { askAI } = require("../ai/ask");

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { prompt, system, model, temperature } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório." });
    }

    const result = await askAI({ prompt, system, model, temperature });
    return res.json({ ok: true, result });
  } catch (err) {
    console.error("AI error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Falha ao consultar o modelo.",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

module.exports = router;