// Carregar variáveis de ambiente primeiro
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const aiRouter = require("./routes/ai").default;
const userRouter = require("./routes/user-register").default;
const flashcardRouter = require("./routes/flashcard").default;
const subjectsRouter = require("./routes/subjects").default;
const summaryRouter = require("./routes/summary").default;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);
app.use("/api/flashcard", flashcardRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/summary", summaryRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});