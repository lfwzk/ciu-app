import React, { createContext, useContext, useState, useEffect } from "react";
import { db, storage } from "../firebase/firebase.config"; // Asegúrate de importar la instancia de Firestore desde tu archivo de configuración de Firebase
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

const newCourse = {
  name: "Nombre del curso",
  description: "Descripción del curso",
  image: null, // Nuevo campo para la imagen
  units: [], // Nuevo campo para las unidades
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

  // Función para crear un curso
  const createCourse = async (newCourse) => {
    try {
      if (newCourse.image) {
        // Sube la imagen a Firebase Storage
        const imageRef = ref(storage, `course-images/${newCourse.image.name}`);
        await uploadBytes(imageRef, newCourse.image);
        // Obtiene la URL de la imagen
        const imageUrl = await getDownloadURL(imageRef);
        // Agrega la URL de la imagen al nuevo curso
        newCourse.image = imageUrl;
      }

      const docRef = await addDoc(collection(db, "courses"), newCourse);
      const courseId = docRef.id;

      await updateDoc(docRef, { id: courseId });

      const createdCourse = { ...newCourse, id: courseId };
      setCourses([...courses, createdCourse]);

      return createdCourse;
    } catch (error) {
      console.error("Error al crear un curso:", error);
      throw error;
    }
  };

  // Función para actualizar un curso
  const updateCourse = async (courseId, updatedCourse) => {
    try {
      if (updatedCourse.image) {
        // Sube la nueva imagen a Firebase Storage
        const imageRef = ref(
          storage,
          `course-images/${updatedCourse.image.name}`
        );
        await uploadBytes(imageRef, updatedCourse.image);
        // Obtiene la URL de la nueva imagen
        const imageUrl = await getDownloadURL(imageRef);
        // Actualiza la URL de la imagen en el curso actualizado
        updatedCourse.image = imageUrl;
      }

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

  // Función para eliminar un curso
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
  // Función para obtener un curso por su ID

  const getCourseById = async (courseId) => {
    try {
      const docRef = doc(db, "courses", courseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.error(`No se encontró ningún curso con el ID ${courseId}`);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el curso por ID:", error);
      throw error;
    }
  };
  // En CourseContext.jsx
  const addUnitToCourse = async (courseId, unitData) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        const units = courseData.units || []; // Asegúrate de que units sea un arreglo

        // Genera un ID único para la unidad en el lado del servidor de Firebase
        const unitRef = await addDoc(
          collection(db, `courses/${courseId}/units`),
          {
            ...unitData,
          }
        );

        // Obtiene el ID generado por Firebase
        const unitId = unitRef.id;

        // Asigna el ID a los datos de la unidad
        unitData.id = unitId;

        // Agrega la nueva unidad al arreglo de unidades
        units.push(unitData);

        // Actualiza las unidades en el documento del curso
        await updateDoc(courseRef, { units });

        // Actualiza el estado local con las unidades actualizadas
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId ? { ...course, units } : course
          )
        );
      } else {
        console.error(`No se encontró ningún curso con el ID ${courseId}`);
      }
    } catch (error) {
      console.error("Error al agregar una unidad al curso:", error);
      throw error;
    }
  };
  const getUnitById = async (courseId, unitId) => {
    try {
      const unitRef = doc(db, `courses/${courseId}/units`, unitId);
      const unitDoc = await getDoc(unitRef);

      if (unitDoc.exists()) {
        return { id: unitDoc.id, ...unitDoc.data() };
      } else {
        console.error(`No se encontró ninguna unidad con el ID ${unitId}`);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener la unidad por ID:", error);
      throw error;
    }
  };

  const updateUnit = async (courseId, unitId, updatedUnitData) => {
    console.log("Llamando a updateUnit con unitId:", unitId);
    console.log("updatedUnitData:", updatedUnitData);

    try {
      // Construye la referencia del documento de la unidad en Firestore
      const unitRef = doc(db, `courses/${courseId}/units/${unitId}`);

      // Actualiza el documento de la unidad con los datos actualizados
      await updateDoc(unitRef, updatedUnitData);

      console.log("Unidad actualizada con éxito");

      return { id: unitId, ...updatedUnitData };
    } catch (error) {
      console.error("Error al actualizar la unidad:", error);
      throw error;
    }
  };
  const deleteUnit = async (courseId, unitId) => {
    try {
      // Construye la referencia del documento de la unidad en Firestore
      const unitRef = doc(db, `courses/${courseId}/units/${unitId}`);

      // Elimina el documento de la unidad
      await deleteDoc(unitRef);

      // Realiza cualquier otra actualización necesaria, como actualizar el estado local

      console.log("Unidad eliminada con éxito");

      // Puedes retornar algún valor si lo deseas
    } catch (error) {
      console.error("Error al eliminar la unidad:", error);
      throw error;
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        createCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        addUnitToCourse,
        getUnitById,
        updateUnit,
        deleteUnit,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
