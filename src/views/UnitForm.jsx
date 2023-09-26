import React, { useState } from "react";
import { useCourse } from "../context/CourseContext";

export const UnitForm = ({ courseId }) => {
  const { addUnitToCourse } = useCourse();
  const [unitData, setUnitData] = useState({
    name: "",
    description: "",
    // Otros campos de unidad
  });

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

  return (
    <div>
      <h3>Agregar Unidad</h3>
      <form onSubmit={handleUnitFormSubmit}>
        <div>
          <label>Nombre de la Unidad</label>
          <input
            type="text"
            name="name"
            value={unitData.name}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Descripción de la Unidad</label>
          <input
            type="text"
            name="description"
            value={unitData.description}
            onChange={handleFormChange}
          />
        </div>
        {/* Otros campos de la unidad */}
        <button type="submit">Agregar Unidad</button>
      </form>
    </div>
  );
};
