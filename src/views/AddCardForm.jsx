import React, { useState } from "react";

export const AddCardForm = ({ onAddCard }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar si tanto la pregunta como la respuesta están presentes
    if (question.trim() === "" || answer.trim() === "") {
      alert("Por favor, completa tanto la pregunta como la respuesta.");
      return;
    }

    // Llamar a la función proporcionada por las props para agregar la tarjeta
    onAddCard({
      question,
      answer,
      repetitions,
      interval,
      easeFactor,
    });

    // Limpiar el formulario después de agregar la tarjeta
    setQuestion("");
    setAnswer("");
    setRepetitions(0);
    setInterval(1);
    setEaseFactor(2.5);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-600"
        >
          Pregunta
        </label>
        <input
          type="text"
          id="question"
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-600"
        >
          Respuesta
        </label>
        <textarea
          id="answer"
          name="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Agregar Tarjeta
      </button>
    </form>
  );
};
