// Carregar variáveis de ambiente primeiro
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const aiRouter = require("./routes/ai").default;
const userRouter = require("./routes/user-register").default;
const flashcardRouter = require("./routes/flashcard").default;
const subjectsRouter = require("./routes/subjects").default;
const summaryRouter = require("./routes/summary").default;
const testRouter = require("./routes/test").default;

const app = express();
const PORT = process.env.PORT || 3001;

// Load Swagger YAML file
const swaggerPath = path.join(__dirname, 'swagger.yaml');
const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
const specs = yaml.load(swaggerFile);

// Update server URL with current PORT
specs.servers = [
  {
    url: `http://localhost:${PORT}`,
    description: "Development server",
  }
];

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumentar limite para aceitar imagens em base64
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rotas
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);
app.use("/api/flashcard", flashcardRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/test", testRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});