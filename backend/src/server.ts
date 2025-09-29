// Carregar variáveis de ambiente primeiro
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const aiRouter = require("./routes/ai").default;
import type { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Rota de AI
app.use("/api/ai", aiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});