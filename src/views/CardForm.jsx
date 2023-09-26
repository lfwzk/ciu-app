import React, { useState, useEffect } from "react";

export const CardForm = ({ unitId, cardToEdit, onSaveCard }) => {
  const [cardData, setCardData] = useState({
    question: "",
    answer: "",
    // Otros campos de tarjeta...
  });

  useEffect(() => {
    if (cardToEdit) {
      setCardData(cardToEdit); // Llena los campos con los datos de la tarjeta a editar
    }
  }, [cardToEdit]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleCardFormSubmit = (e) => {
    e.preventDefault();

    // Llama a la función onSaveCard para guardar la tarjeta en la unidad correspondiente
    onSaveCard(unitId, cardData);

    // Limpia el formulario o realiza cualquier otra acción necesaria
    setCardData({
      question: "",
      answer: "",
      // Otros campos de tarjeta...
    });
  };

  return (
    <div>
      <h3>{cardToEdit ? "Editar Tarjeta" : "Agregar Tarjeta"}</h3>
      <form onSubmit={handleCardFormSubmit}>
        <div>
          <label>Pregunta</label>
          <input
            type="text"
            name="question"
            value={cardData.question}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Respuesta</label>
          <input
            type="text"
            name="answer"
            value={cardData.answer}
            onChange={handleFormChange}
          />
        </div>
        {/* Otros campos de tarjeta */}
        <button type="submit">Guardar Tarjeta</button>
      </form>
    </div>
  );
};
