import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { db } from "../firebase/firebase.config"; // As
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

export const Dashboardview = () => {
  const { courses, createCourse, deleteCourse, createUnit, createCard } =
    useCourse();
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newUnitName, setNewUnitName] = useState(""); // Agrega el estado para el nombre de la unidad
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [units, setUnits] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      // Si no se ha seleccionado un curso y hay cursos disponibles, selecciona el primer curso
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  // Función para cargar unidades y tarjetas del curso seleccionado
  useEffect(() => {
    if (selectedCourse) {
      // Verificar si se ha seleccionado un curso
      loadUnitsAndCards(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadUnitsAndCards = async (courseId) => {
    try {
      // Cargar unidades
      const unitsQuerySnapshot = await getDocs(
        collection(db, `courses/${courseId}/units`)
      );
      const unitsData = unitsQuerySnapshot.docs.map((unitDoc) => ({
        id: unitDoc.id,
        ...unitDoc.data(),
      }));
      setUnits(unitsData);

      // Cargar tarjetas
      const cardsQuerySnapshot = await getDocs(
        collection(db, `courses/${courseId}/cards`)
      );
      const cardsData = cardsQuerySnapshot.docs.map((cardDoc) => ({
        id: cardDoc.id,
        ...cardDoc.data(),
      }));
      setCards(cardsData);
    } catch (error) {
      console.error("Error al cargar unidades y tarjetas:", error);
    }
  };

  const handleCreateCourse = async () => {
    if (newCourseName.trim() !== "") {
      const newCourse = {
        name: newCourseName,
        description: newCourseDescription,
      };
      const createdCourse = await createCourse(newCourse);
      setNewCourseName("");
      setNewCourseDescription("");
      setSelectedCourse(createdCourse); // Establecer el curso recién creado como seleccionado
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      await deleteCourse(courseId);
      setSelectedCourse(null); // Reiniciar la selección del curso
    }
  };

  // Función para crear una unidad en el curso seleccionado
  const handleCreateUnit = async () => {
    if (selectedCourse && newUnitName.trim() !== "") {
      const newUnit = {
        name: newUnitName,
      };
      await createUnit(selectedCourse.id, newUnit);
      setNewUnitName("");
      loadUnitsAndCards(selectedCourse.id); // Recargar unidades y tarjetas después de crear la unidad
    }
  };

  // Función para crear una tarjeta en la unidad seleccionada del curso seleccionado
  const handleCreateCard = async () => {
    if (
      selectedUnit &&
      newCardFront.trim() !== "" &&
      newCardBack.trim() !== ""
    ) {
      const newCard = {
        frontText: newCardFront,
        backText: newCardBack,
      };
      await createCard(selectedCourse.id, selectedUnit.id, newCard);
      setNewCardFront("");
      setNewCardBack("");
      loadUnitsAndCards(selectedCourse.id); // Recargar unidades y tarjetas después de crear la tarjeta
    }
  };

  return (
    <div>
      <h2>Lista de Cursos</h2>
      <ul>
        {courses.map((course) => (
          <li
            key={course.id}
            onClick={() => setSelectedCourse(course)} // Establecer el curso como seleccionado al hacer clic
            className={
              selectedCourse?.id === course.id ? "selected-course" : ""
            }
          >
            {course.name} - {course.description}
            <button onClick={() => handleDeleteCourse(course.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Nuevo Curso"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newCourseDescription}
          onChange={(e) => setNewCourseDescription(e.target.value)}
        />
        <button onClick={handleCreateCourse}>Agregar Curso</button>
      </div>

      {selectedCourse && (
        <div>
          <h2>Unidades del Curso</h2>
          <ul>
            {units.map((unit) => (
              <li key={unit.id}>{unit.name}</li>
            ))}
          </ul>

          <h2>Tarjetas del Curso</h2>
          <ul>
            {cards.map((card) => (
              <li key={card.id}>
                {card.frontText} - {card.backText}
              </li>
            ))}
          </ul>

          <div>
            <input
              type="text"
              placeholder="Nueva Unidad"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
            />
            <button onClick={handleCreateUnit}>Agregar Unidad</button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Texto Frente"
              value={newCardFront}
              onChange={(e) => setNewCardFront(e.target.value)}
            />
            <input
              type="text"
              placeholder="Texto Atrás"
              value={newCardBack}
              onChange={(e) => setNewCardBack(e.target.value)}
            />
            <button onClick={handleCreateCard}>Agregar Tarjeta</button>
          </div>
        </div>
      )}
    </div>
  );
};
