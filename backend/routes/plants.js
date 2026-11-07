// =============================================
// Маршруты для растений (товаров магазина): /api/plants
// =============================================
const express = require("express");
const { nanoid } = require("nanoid");
const { plants } = require("../data");

// Router — «мини-приложение» Express со своими маршрутами.
// В app.js он подключается по префиксу /api/plants,
// поэтому здесь "/" означает /api/plants, а "/:id" — /api/plants/:id
const router = express.Router();

// Функция-помощник: найти растение по id или сразу ответить 404
function findPlantOr404(id, res) {
  const plant = plants.find((p) => p.id === id);
  if (!plant) {
    res.status(404).json({ error: "Plant not found" });
    return null;
  }
  return plant;
}

// Проверка полей растения. Возвращает текст ошибки или null, если всё верно.
// partial = true — для PATCH (проверяем только переданные поля)
function validatePlant(body, partial = false) {
  const { name, category, description, price, stock, rating } = body;

  if (!partial || name !== undefined) {
    if (typeof name !== "string" || !name.trim()) return "Name is required";
  }
  if (!partial || category !== undefined) {
    if (typeof category !== "string" || !category.trim()) return "Category is required";
  }
  if (description !== undefined && typeof description !== "string") {
    return "Description must be a string";
  }
  if (!partial || price !== undefined) {
    if (!Number.isFinite(Number(price)) || Number(price) < 0) return "Price must be a number >= 0";
  }
  if (!partial || stock !== undefined) {
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) return "Stock must be an integer >= 0";
  }
  if (rating !== undefined && rating !== null && rating !== "") {
    if (!Number.isFinite(Number(rating)) || Number(rating) < 0 || Number(rating) > 5) {
      return "Rating must be between 0 and 5";
    }
  }
  return null;
}

/**
 * @swagger
 * /api/plants:
 *   get:
 *     summary: Возвращает список всех растений
 *     tags: [Plants]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Фильтр по категории (например, Кактусы)
 *     responses:
 *       200:
 *         description: Список растений
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plant'
 */
router.get("/", (req, res) => {
  const { category } = req.query;
  if (category) {
    return res.json(plants.filter((p) => p.category === category));
  }
  res.json(plants);
});

/**
 * @swagger
 * /api/plants/{id}:
 *   get:
 *     summary: Получает растение по ID
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID растения
 *     responses:
 *       200:
 *         description: Данные растения
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       404:
 *         description: Растение не найдено
 */
router.get("/:id", (req, res) => {
  const plant = findPlantOr404(req.params.id, res);
  if (!plant) return;
  res.json(plant);
});

/**
 * @swagger
 * /api/plants:
 *   post:
 *     summary: Создаёт новое растение
 *     tags: [Plants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlantInput'
 *     responses:
 *       201:
 *         description: Растение успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         description: Ошибка в теле запроса
 */
router.post("/", (req, res) => {
  const error = validatePlant(req.body);
  if (error) return res.status(400).json({ error });

  const { name, category, description, price, stock, rating, image } = req.body;

  const newPlant = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: (description || "").trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating === undefined || rating === null || rating === "" ? null : Number(rating),
    image: image || "/images/default.svg",
  };

  plants.push(newPlant);
  res.status(201).json(newPlant);
});

/**
 * @swagger
 * /api/plants/{id}:
 *   patch:
 *     summary: Частично обновляет растение (передаются только изменяемые поля)
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID растения
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlantInput'
 *           example:
 *             price: 1690
 *             stock: 3
 *     responses:
 *       200:
 *         description: Обновлённое растение
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         description: Нет данных для обновления или данные некорректны
 *       404:
 *         description: Растение не найдено
 */
router.patch("/:id", (req, res) => {
  const plant = findPlantOr404(req.params.id, res);
  if (!plant) return;

  const fields = ["name", "category", "description", "price", "stock", "rating", "image"];
  // Нельзя PATCH без полей
  if (!req.body || !fields.some((f) => req.body[f] !== undefined)) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const error = validatePlant(req.body, true);
  if (error) return res.status(400).json({ error });

  const { name, category, description, price, stock, rating, image } = req.body;
  if (name !== undefined) plant.name = name.trim();
  if (category !== undefined) plant.category = category.trim();
  if (description !== undefined) plant.description = description.trim();
  if (price !== undefined) plant.price = Number(price);
  if (stock !== undefined) plant.stock = Number(stock);
  if (rating !== undefined) plant.rating = rating === "" || rating === null ? null : Number(rating);
  if (image !== undefined) plant.image = image;

  res.json(plant);
});

/**
 * @swagger
 * /api/plants/{id}:
 *   delete:
 *     summary: Удаляет растение
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID растения
 *     responses:
 *       204:
 *         description: Растение успешно удалено (нет тела ответа)
 *       404:
 *         description: Растение не найдено
 */
router.delete("/:id", (req, res) => {
  const index = plants.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Plant not found" });

  // splice удаляет элемент прямо из общего массива
  plants.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
