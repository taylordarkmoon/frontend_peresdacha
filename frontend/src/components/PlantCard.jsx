import React from "react";
import { SERVER_URL } from "../api";

// Карточка одного растения
export default function PlantCard({ plant, onEdit, onDelete }) {
    return (
        <div className="plantCard">
            <div className="plantCard__image">
                <img src={`${SERVER_URL}${plant.image}`} alt={plant.name} />
                <span className="plantCard__category">{plant.category}</span>
            </div>

            <div className="plantCard__body">
                <div className="plantCard__top">
                    <h3 className="plantCard__name">{plant.name}</h3>
                    {plant.rating != null && (
                        <span className="plantCard__rating">★ {plant.rating}</span>
                    )}
                </div>

                <p className="plantCard__description">{plant.description}</p>

                <div className="plantCard__info">
                    <span className="plantCard__price">{plant.price.toLocaleString("ru-RU")} ₽</span>
                    <span className={plant.stock > 0 ? "plantCard__stock" : "plantCard__stock plantCard__stock--empty"}>
                        {plant.stock > 0 ? `На складе: ${plant.stock} шт.` : "Нет в наличии"}
                    </span>
                </div>

                <div className="plantCard__actions">
                    <button className="btn" onClick={() => onEdit(plant)}>
                        Редактировать
                    </button>
                    <button className="btn btn--danger" onClick={() => onDelete(plant.id)}>
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}
