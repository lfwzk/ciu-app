import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase.config"; // Asegúrate de importar la instancia de Firestore desde tu archivo de configuración de Firebase
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

const newCourse = {
  name: "Nombre del curso",
  description: "Descripción del curso",
  // Otros campos...
};

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error(
      "useCourse debe utilizarse dentro de un proveedor CourseProvider"
    );
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar cursos desde Firestore
  const loadCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar cursos desde Firestore:", error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);
  //create
  const createCourse = async (newCourse) => {
    try {
      // Crear el nuevo curso en Firestore
      const docRef = await addDoc(collection(db, "courses"), newCourse);

      // Obtener el ID del nuevo curso
      const courseId = docRef.id;

      // Actualizar el curso recién creado con el ID asignado por Firestore
      await updateDoc(docRef, { id: courseId });

      // Agregar el curso a la lista de cursos en el estado
      const createdCourse = { ...newCourse, id: courseId };
      setCourses([...courses, createdCourse]);

      return createdCourse;
    } catch (error) {
      console.error("Error al crear un curso:", error);
      throw error;
    }
  };
  const createUnit = async (courseId, newUnit) => {
    try {
      // Agregar la nueva unidad a la colección "units" dentro del documento de curso en Firestore
      const docRef = await addDoc(
        collection(db, "courses", courseId, "units"),
        newUnit
      );

      // Obtener el ID asignado a la nueva unidad
      const unitId = docRef.id;

      // Actualizar el documento de unidad recién creado con el ID asignado por Firestore
      await updateDoc(docRef, { id: unitId });

      // Agregar la unidad a la lista de unidades en el estado del curso
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              units: [...(course.units || []), { ...newUnit, id: unitId }],
            }
          : course
      );
      setCourses(updatedCourses);

      return unitId;
    } catch (error) {
      console.error("Error al crear una unidad:", error);
      throw error;
    }
  };

  // Función para crear una tarjeta en una unidad específica de un curso
  const createCard = async (courseId, unitId, newCard) => {
    try {
      // Agregar la nueva tarjeta a la colección "cards" dentro del documento de unidad en Firestore
      const docRef = await addDoc(
        collection(db, "courses", courseId, "units", unitId, "cards"),
        newCard
      );

      // Obtener el ID asignado a la nueva tarjeta
      const cardId = docRef.id;

      // Actualizar el documento de tarjeta recién creado con el ID asignado por Firestore
      await updateDoc(docRef, { id: cardId });

      // Agregar la tarjeta a la lista de tarjetas en el estado de la unidad
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              units: (course.units || []).map((unit) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      cards: [
                        ...(unit.cards || []),
                        { ...newCard, id: cardId },
                      ],
                    }
                  : unit
              ),
            }
          : course
      );
      setCourses(updatedCourses);

      return cardId;
    } catch (error) {
      console.error("Error al crear una tarjeta:", error);
      throw error;
    }
  };

  //end create

  //update
  const updateCourse = async (courseId, updatedCourse) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, updatedCourse);
      const updatedCourses = courses.map((course) =>
        course.id === courseId ? { ...course, ...updatedCourse } : course
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
      throw error;
    }
  };
  const updateUnit = async (courseId, unitId, updatedUnit) => {
    try {
      const unitRef = doc(db, "courses", courseId, "units", unitId);
      await updateDoc(unitRef, updatedUnit);

      // Actualizar la unidad en el estado del curso
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              units: (course.units || []).map((unit) =>
                unit.id === unitId ? { ...unit, ...updatedUnit } : unit
              ),
            }
          : course
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error al actualizar una unidad:", error);
      throw error;
    }
  };

  // Función para actualizar una tarjeta en una unidad específica de un curso
  const updateCard = async (courseId, unitId, cardId, updatedCard) => {
    try {
      const cardRef = doc(
        db,
        "courses",
        courseId,
        "units",
        unitId,
        "cards",
        cardId
      );
      await updateDoc(cardRef, updatedCard);

      // Actualizar la tarjeta en el estado de la unidad
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              units: (course.units || []).map((unit) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      cards: (unit.cards || []).map((card) =>
                        card.id === cardId ? { ...card, ...updatedCard } : card
                      ),
                    }
                  : unit
              ),
            }
          : course
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error al actualizar una tarjeta:", error);
      throw error;
    }
  };

  //endupdate

  //delete

  const deleteCourse = async (courseId) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      await deleteDoc(courseRef);
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      throw error;
    }
  };

  // Función para eliminar una unidad de un curso específico
  const deleteUnit = async (courseId, unitId) => {
    try {
      const unitRef = doc(db, "courses", courseId, "units", unitId);
      await deleteDoc(unitRef);

      // Eliminar la unidad del estado del curso
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              units: (course.units || []).filter((unit) => unit.id !== unitId),
            }
          : course
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error al eliminar una unidad:", error);
      throw error;
    }
  };

  // Función para eliminar una tarjeta de una unidad específica de un curso
  const deleteCard = async (courseId, unitId, cardId) => {
    try {
      const cardRef = doc(
        db,
        "courses",
        courseId,
        "units",
        unitId,
        "cards",
        cardId
      );
      await deleteDoc(cardRef);

      // Eliminar la tarjeta del estado de la unidad
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              units: (course.units || []).map((unit) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      cards: (unit.cards || []).filter(
                        (card) => card.id !== cardId
                      ),
                    }
                  : unit
              ),
            }
          : course
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error al eliminar una tarjeta:", error);
      throw error;
    }
  };

  //end delete

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        createCourse,
        updateCourse,
        deleteCourse,
        createUnit,
        createCard,
        updateUnit,
        updateCard,
        deleteUnit,
        deleteCard,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
