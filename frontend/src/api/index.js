// =============================================
// API-клиент: все обращения к серверу собраны в одном месте.
// axios отправляет HTTP-запросы и сам превращает JSON-ответ в объект.
// =============================================
import axios from "axios";

// Адрес сервера (нужен ещё и для картинок: /images/...)
export const SERVER_URL = "http://localhost:3000";

const apiClient = axios.create({
    baseURL: `${SERVER_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

export const api = {
    // POST /api/plants — добавить растение
    createPlant: async (plant) => {
        const response = await apiClient.post("/plants", plant);
        return response.data;
    },
    // GET /api/plants — получить список растений
    getPlants: async () => {
        const response = await apiClient.get("/plants");
        return response.data;
    },
    // GET /api/plants/:id — получить одно растение
    getPlantById: async (id) => {
        const response = await apiClient.get(`/plants/${id}`);
        return response.data;
    },
    // PATCH /api/plants/:id — изменить растение
    updatePlant: async (id, plant) => {
        const response = await apiClient.patch(`/plants/${id}`, plant);
        return response.data;
    },
    // DELETE /api/plants/:id — удалить растение (сервер отвечает 204 без тела)
    deletePlant: async (id) => {
        await apiClient.delete(`/plants/${id}`);
    },
};
