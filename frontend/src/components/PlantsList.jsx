import React from "react";
import PlantCard from "./PlantCard";

// Сетка карточек растений
export default function PlantsList({ plants, onEdit, onDelete }) {
    if (!plants.length) {
        return <div className="empty">Растений пока нет</div>;
    }

    return (
        <div className="grid">
            {plants.map((p) => (
                <PlantCard key={p.id} plant={p} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
