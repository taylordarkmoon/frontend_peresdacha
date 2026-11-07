# Зелёный уголок — интернет-магазин комнатных растений

Клиент-серверное приложение на **React + Node.js/Express** с REST API и документацией **Swagger**.
За основу взято приложение из практических занятий №4–5. Вместо сущности `User` в нём используется собственная сущность **`Plant`** (растение).

Выполнила: Шатунова В.К., группа ЭФБО-05-24.

## Структура проекта

```
plant-shop/
├── backend/                  серверная часть (Node.js + Express), порт 3000
│   ├── app.js                точка входа: middleware, CORS, Swagger, подключение маршрутов
│   ├── swagger.js            настройка Swagger и описание схем Plant / PlantInput
│   ├── data.js               начальные данные — 12 растений
│   ├── routes/plants.js      CRUD-маршруты /api/plants + JSDoc-аннотации Swagger
│   └── public/images/        изображения растений
└── frontend/                 клиентская часть (React), порт 3001
    └── src/
        ├── api/index.js      API-клиент на axios
        ├── components/       PlantCard, PlantsList, PlantModal
        └── pages/PlantsPage/ страница каталога + стили на SCSS
```

## Сущность Plant

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | уникальный идентификатор (генерируется `nanoid`) |
| `name` | string | название растения — **обязательное** |
| `category` | string | категория (Тропические, Суккуленты, Кактусы, Цветущие, Пальмы) — **обязательное** |
| `description` | string | описание и советы по уходу |
| `price` | number | цена в рублях, ≥ 0 — **обязательное** |
| `stock` | integer | количество на складе, ≥ 0 — **обязательное** |
| `rating` | number \| null | рейтинг от 0 до 5 |
| `image` | string | путь к изображению на сервере |

## REST API

| Метод | Путь | Описание | Ответ |
|---|---|---|---|
| GET | `/api/plants` | список растений (можно `?category=Кактусы`) | 200 |
| GET | `/api/plants/:id` | растение по идентификатору | 200 / 404 |
| POST | `/api/plants` | добавить растение | 201 / 400 |
| PATCH | `/api/plants/:id` | изменить растение (только переданные поля) | 200 / 400 / 404 |
| DELETE | `/api/plants/:id` | удалить растение | 204 / 404 |

Документация Swagger UI доступна по адресу **http://localhost:3000/api-docs**.

## Запуск

Нужен установленный **Node.js**. Сервер и клиент запускаются в **двух разных терминалах**.

**Терминал 1 — сервер:**
```bash
cd backend
npm install
npm start
```
В консоли появится `Сервер запущен на http://localhost:3000`.

**Терминал 2 — клиент:**
```bash
cd frontend
npm install
npm start
```
Браузер откроет **http://localhost:3001** (порт задан в скрипте `start` в `frontend/package.json`).

## Выполнение требований

| № | Требование | Где выполнено |
|---|---|---|
| 1 | Запуск серверной части на Node.js + Express | `backend/app.js`, команда `npm start` |
| 2 | Проверка работы REST API | Swagger UI (`/api-docs`, кнопка *Try it out*), браузер, логи запросов в консоли сервера |
| 3 | CRUD: список, по id, добавление, изменение, удаление | `backend/routes/plants.js` — GET, GET/:id, POST, PATCH/:id, DELETE |
| 4 | Клиент на React взаимодействует с API | `frontend/src/api/index.js` (axios), `PlantsPage.jsx`; CORS настроен в `app.js` |
| 5 | Своя сущность вместо `User`, ≥ 3 содержательных полей | `Plant`: name, category, description, price, stock, rating, image |
| 6 | Клиент и сервер адаптированы под новую сущность | маршруты `/api/plants`, компоненты `PlantCard`, `PlantsList`, `PlantModal` |
| 7 | Документация Swagger/OpenAPI | `backend/swagger.js` (схемы `Plant`, `PlantInput`), аннотации в `routes/plants.js`, UI на `/api-docs` |

## Технологии

Node.js, Express, nanoid, cors, swagger-jsdoc, swagger-ui-express, React 18, axios, Sass.
