import React, { useState } from "react";

export const CardForm = ({ onAddCard }) => {
  const [modalidad, setModalidad] = useState(""); // Estado para rastrear la modalidad
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleAddCard = () => {
    if (front.trim() === "" || back.trim() === "") {
      // Validación simple para asegurarse de que ambos campos estén llenos
      alert("Por favor, completa ambos lados de la tarjeta.");
      return;
    }

    // Crea un objeto de tarjeta con el frente y el reverso y la modalidad seleccionada
    const newCard = {
      modalidad,
      front,
      back,
    };

    // Llama a la función onAddCard para agregar la tarjeta
    onAddCard(newCard);

    // Limpia los campos del formulario y la modalidad
    setModalidad("");
    setFront("");
    setBack("");
  };

  return (
    <div>
      <h3>Agregar Tarjeta</h3>
      <div>
        <label>Modalidad</label>
        <select
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value)}
        >
          <option value="">Selecciona una modalidad</option>
          <option value="memorizacion">Memorización</option>
          <option value="subtitulos">Subtítulos de video</option>
        </select>
      </div>
      <div>
        <label>Frente de la Tarjeta</label>
        <input
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
      </div>
      <div>
        <label>Reverso de la Tarjeta</label>
        <input
          type="text"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
      </div>
      <button onClick={handleAddCard}>Agregar Tarjeta</button>
    </div>
  );
};
