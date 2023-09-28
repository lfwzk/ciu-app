import React, { useState } from "react";
import { useCourse } from "../context/CourseContext";
import { CardForm } from "./CardForm";

export const UnitForm = ({ courseId }) => {
  const { addUnitToCourse } = useCourse();
  const [unitData, setUnitData] = useState({
    name: "",
    description: "",
    // Otros campos de unidad
  });
  const [modalidad, setModalidad] = useState(""); // Estado para rastrear la modalidad
  const [cards, setCards] = useState([]); // Estado para almacenar las tarjetas

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUnitData({
      ...unitData,
      [name]: value,
    });
  };

  const handleUnitFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llama a la función addUnitToCourse para agregar la unidad al curso
      await addUnitToCourse(courseId, unitData);
      // Limpia el formulario o realiza cualquier otra acción necesaria
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
    }
  };
  const handleAddCard = (newCard) => {
    // Agrega la nueva tarjeta al estado de tarjetas
    setCards([...cards, newCard]);
  };

  return (
    <div className=" p-6 rounded shadow-md">
      <h3 className="text-xl mb-4">Agregar Unidad</h3>
      <form onSubmit={handleUnitFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            Nombre de la Unidad
          </label>
          <input
            type="text"
            name="name"
            value={unitData.name}
            onChange={handleFormChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium ">
            Descripción de la Unidad
          </label>
          <input
            type="text"
            name="description"
            value={unitData.description}
            onChange={handleFormChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        {/* Otros campos de la unidad */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Unidad
        </button>
      </form>
    </div>
  );
};
