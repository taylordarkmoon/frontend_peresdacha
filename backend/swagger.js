// =============================================
// Настройка Swagger (OpenAPI 3.0)
// swagger-jsdoc собирает спецификацию из комментариев /** @swagger */,
// swagger-ui-express показывает её как интерактивную страницу /api-docs
// =============================================
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const port = 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API магазина комнатных растений",
      version: "1.0.0",
      description: "REST API для управления каталогом комнатных растений (CRUD-операции над сущностью Plant)",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
    tags: [{ name: "Plants", description: "Растения — товары магазина" }],
  },
  // Файлы, в которых лежат JSDoc-комментарии с описанием API
  apis: [path.join(__dirname, "swagger.js"), path.join(__dirname, "routes", "*.js")],
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Plant:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID растения
 *         name:
 *           type: string
 *           description: Название растения
 *         category:
 *           type: string
 *           description: Категория
 *         description:
 *           type: string
 *           description: Описание растения
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           nullable: true
 *           description: Рейтинг от 0 до 5
 *         image:
 *           type: string
 *           description: Путь к изображению на сервере
 *       example:
 *         id: "x7Kp2a"
 *         name: "Монстера деликатесная"
 *         category: "Тропические"
 *         description: "Крупные резные листья, любит рассеянный свет."
 *         price: 1890
 *         stock: 12
 *         rating: 4.8
 *         image: "/images/monstera.svg"
 *     PlantInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         rating:
 *           type: number
 *       example:
 *         name: "Пеперомия"
 *         category: "Тропические"
 *         description: "Компактное растение с плотными листьями."
 *         price: 690
 *         stock: 10
 *         rating: 4.4
 */

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
