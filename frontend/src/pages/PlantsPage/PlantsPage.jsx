import React, { useEffect, useState } from "react";
import "./PlantsPage.scss";

import PlantsList from "../../components/PlantsList";
import PlantModal from "../../components/PlantModal";
import { api } from "../../api";

export default function PlantsPage() {
    const [plants, setPlants] = useState([]);       // список растений с сервера
    const [loading, setLoading] = useState(true);   // идёт ли загрузка
    const [error, setError] = useState("");         // текст ошибки загрузки
    const [category, setCategory] = useState("Все"); // выбранный фильтр

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // create | edit
    const [editingPlant, setEditingPlant] = useState(null);

    // Загружаем растения один раз при открытии страницы
    useEffect(() => {
        loadPlants();
    }, []);

    const loadPlants = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await api.getPlants(); // GET /api/plants
            setPlants(data);
        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить растения. Проверьте, что сервер запущен на http://localhost:3000");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingPlant(null);
        setModalOpen(true);
    };

    const openEdit = (plant) => {
        setModalMode("edit");
        setEditingPlant(plant);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingPlant(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить растение?");
        if (!ok) return;

        try {
            await api.deletePlant(id); // DELETE /api/plants/:id
            setPlants((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
            alert("Ошибка удаления растения");
        }
    };

    const handleSubmitModal = async (payload) => {
        const { id, ...data } = payload; // id не отправляем в теле запроса
        try {
            if (modalMode === "create") {
                const newPlant = await api.createPlant(data); // POST /api/plants
                setPlants((prev) => [...prev, newPlant]);
            } else {
                const updatedPlant = await api.updatePlant(id, data); // PATCH /api/plants/:id
                setPlants((prev) => prev.map((p) => (p.id === id ? updatedPlant : p)));
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Ошибка сохранения растения");
        }
    };

    // Список категорий для фильтра строим из самих данных
    const categories = ["Все", ...new Set(plants.map((p) => p.category))];
    const visiblePlants = category === "Все" ? plants : plants.filter((p) => p.category === category);

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">🌿 Зелёный уголок</div>
                    <div className="header__right">Магазин комнатных растений</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Каталог растений</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Добавить растение
                        </button>
                    </div>

                    <div className="filters">
                        {categories.map((c) => (
                            <button
                                key={c}
                                className={c === category ? "chip chip--active" : "chip"}
                                onClick={() => setCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : error ? (
                        <div className="empty empty--error">{error}</div>
                    ) : (
                        <PlantsList plants={visiblePlants} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">© {new Date().getFullYear()} Зелёный уголок</div>
            </footer>

            <PlantModal
                open={modalOpen}
                mode={modalMode}
                initialPlant={editingPlant}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}
