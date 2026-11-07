import React, { useEffect, useState } from "react";

const CATEGORIES = ["Тропические", "Суккуленты", "Кактусы", "Цветущие", "Пальмы"];

// Модальное окно для создания и редактирования растения
export default function PlantModal({ open, mode, initialPlant, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [rating, setRating] = useState("");

    // При каждом открытии окна заполняем поля данными растения (или очищаем)
    useEffect(() => {
        if (!open) return;
        setName(initialPlant?.name ?? "");
        setCategory(initialPlant?.category ?? CATEGORIES[0]);
        setDescription(initialPlant?.description ?? "");
        setPrice(initialPlant?.price != null ? String(initialPlant.price) : "");
        setStock(initialPlant?.stock != null ? String(initialPlant.stock) : "");
        setRating(initialPlant?.rating != null ? String(initialPlant.rating) : "");
    }, [open, initialPlant]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование растения" : "Новое растение";

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const parsedPrice = Number(price);
        const parsedStock = Number(stock);
        const parsedRating = rating === "" ? null : Number(rating);

        // Проверяем данные до отправки на сервер
        if (!trimmedName) {
            alert("Введите название");
            return;
        }
        if (price === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
            alert("Введите корректную цену");
            return;
        }
        if (stock === "" || !Number.isInteger(parsedStock) || parsedStock < 0) {
            alert("Количество на складе — целое число от 0");
            return;
        }
        if (parsedRating !== null && (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5)) {
            alert("Рейтинг — число от 0 до 5");
            return;
        }

        onSubmit({
            id: initialPlant?.id,
            name: trimmedName,
            category,
            description: description.trim(),
            price: parsedPrice,
            stock: parsedStock,
            rating: parsedRating,
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например, Пеперомия"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория
                        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="input input--textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Уход, размер, особенности"
                        />
                    </label>

                    <div className="form__row">
                        <label className="label">
                            Цена, ₽
                            <input className="input" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
                        </label>
                        <label className="label">
                            На складе, шт.
                            <input className="input" value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" />
                        </label>
                        <label className="label">
                            Рейтинг
                            <input className="input" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="0–5" inputMode="decimal" />
                        </label>
                    </div>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
