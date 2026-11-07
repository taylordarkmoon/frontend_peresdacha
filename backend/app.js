// =============================================
// Сервер интернет-магазина комнатных растений
// Express + CORS + Swagger
// Запуск: npm start  →  http://localhost:3000
// Документация: http://localhost:3000/api-docs
// =============================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
const plantsRouter = require("./routes/plants");

const app = express();
const port = 3000;

// Middleware для парсинга JSON в теле запроса (req.body)
app.use(express.json());

// CORS: разрешаем запросы от React-приложения, которое работает на порту 3001
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware для логирования запросов
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      console.log("Body:", req.body);
    }
  });
  next();
});

// Раздаём картинки растений из папки public/images
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// Swagger UI по адресу /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Маршруты API
app.use("/api/plants", plantsRouter);

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // Если пришёл некорректный JSON — это ошибка клиента, а не сервера
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});
