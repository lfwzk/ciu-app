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
  setDoc,
  query, // Agrega esta línea para importar 'query'
  where, // Si también utilizas 'where', asegúrate de importarlo
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
  const [userEnrollments, setUserEnrollments] = useState([]);

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

  const enrollUserInCourse = async (userId, courseId) => {
    try {
      // Verificar si el usuario ya está matriculado en el curso
      const isEnrolled = userEnrollments.some(
        (enrollment) =>
          enrollment.userId === userId && enrollment.courseId === courseId
      );

      if (!isEnrolled) {
        // Matricular al usuario en el curso (implementa la lógica aquí)
        // Ejemplo de almacenamiento en Firestore
        await setDoc(doc(db, "enrollments", `${userId}_${courseId}`), {
          userId,
          courseId,
        });

        // Agregar la matriculación a la lista de matriculaciones de usuario
        setUserEnrollments((prevEnrollments) => [
          ...prevEnrollments,
          { userId, courseId },
        ]);
      }
    } catch (error) {
      console.error("Error al matricular al usuario en el curso:", error);
      throw error;
    }
  };

  // Función para verificar si un usuario está matriculado en un curso
  const checkEnrollmentStatus = async (userId, courseId) => {
    try {
      const enrollmentDoc = await getDoc(
        doc(db, "enrollments", `${userId}_${courseId}`)
      );

      return enrollmentDoc.exists();
    } catch (error) {
      console.error("Error al verificar el estado de matriculación:", error);
      throw error;
    }
  };
  const getCoursesByUserId = async (userId) => {
    try {
      // Consulta la colección "enrollments" para obtener los cursos matriculados por el usuario
      const querySnapshot = await getDocs(
        query(collection(db, "enrollments"), where("userId", "==", userId))
      );

      const enrolledCourses = [];

      for (const docSnapshot of querySnapshot.docs) {
        const enrollmentData = docSnapshot.data();
        const courseId = enrollmentData.courseId;

        // Consulta la colección "courses" para obtener los detalles del curso
        const courseDoc = await getDoc(doc(db, "courses", courseId));

        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          enrolledCourses.push({ id: courseId, ...courseData });
        }
      }

      return enrolledCourses;
    } catch (error) {
      console.error("Error al obtener cursos matriculados por usuario:", error);
      throw error;
    }
  };
  const addCardToUnit = async (courseId, unitId, cardData) => {
    try {
      const unitRef = doc(db, `courses/${courseId}/units`, unitId);
      const unitDoc = await getDoc(unitRef);

      if (unitDoc.exists()) {
        const unitData = unitDoc.data();
        const cards = unitData.cards || []; // Asegúrate de que cards sea un arreglo

        // Genera un ID único para la tarjeta en el lado del servidor de Firebase

        cardData.repetitions =
          typeof cardData.repetitions === "number" ? cardData.repetitions : 0;
        cardData.interval =
          typeof cardData.interval === "number" ? cardData.interval : 1;
        cardData.easeFactor =
          typeof cardData.easeFactor === "number" ? cardData.easeFactor : 2.5;
        const cardRef = await addDoc(
          collection(db, `courses/${courseId}/units/${unitId}/cards`),
          {
            ...cardData,
          }
        );

        // Obtiene el ID generado por Firebase
        const cardId = cardRef.id;

        // Asigna el ID a los datos de la tarjeta
        cardData.id = cardId;

        // Agrega la nueva tarjeta al arreglo de tarjetas
        cards.push(cardData);

        // Actualiza las tarjetas en el documento de la unidad
        await updateDoc(unitRef, { cards });

        // Actualiza el estado local con las tarjetas actualizadas
        // (este paso es opcional si estás haciendo una carga completa de las unidades desde Firebase)
        // ... implementa la lógica para actualizar el estado local aquí si es necesario ...
      } else {
        console.error(`No se encontró ninguna unidad con el ID ${unitId}`);
      }
    } catch (error) {
      console.error("Error al agregar una tarjeta a la unidad:", error);
      throw error;
    }
  };

  const getCardsByUnitId = async (courseId, unitId) => {
    try {
      if (!courseId || !unitId) {
        throw new Error("courseId o unitId no están definidos.");
      }

      const cardsRef = collection(
        db,
        `courses/${courseId}/units/${unitId}/cards`
      );
      const querySnapshot = await getDocs(cardsRef);

      if (querySnapshot.empty) {
        console.log("No se encontraron tarjetas para esta unidad.");
        return [];
      }

      const cards = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      console.log("Course ID:", courseId);
      console.log("Unit ID:", unitId);
      console.log("Cards:", cards);

      return cards;
    } catch (error) {
      console.error(
        "Error al obtener las tarjetas de la unidad:",
        error.message
      );
      throw error;
    }
  };

  // Supermemo Algorithm

  const applySuperMemoAlgorithm = async (
    courseId,
    unitId,
    cardId,
    responseQuality
  ) => {
    try {
      const cardRef = doc(
        db,
        `courses/${courseId}/units/${unitId}/cards`,
        cardId
      );
      const cardDoc = await getDoc(cardRef);

      if (cardDoc.exists()) {
        const cardData = cardDoc.data();
        const { repetitions, interval, easeFactor } = cardData;

        // Parámetros del algoritmo SM2
        const INITIAL_EF = 2.5; // Factor de olvido inicial
        const MINIMUM_EF = 1.3; // Factor de olvido mínimo
        const CORRECT_ANSWER_QUALITY = 4; // Calidad de respuesta para respuestas correctas (en una escala del 1 al 5)
        const INCORRECT_ANSWER_QUALITY = 1; // Calidad de respuesta para respuestas incorrectas (en una escala del 1 al 5)

        // Calcular el nuevo intervalo y el factor de facilidad (EF)
        let updatedRepetitions = repetitions || 0; // Establece un valor predeterminado si repetitions es undefined
        let updatedInterval = interval;
        let updatedEaseFactor = easeFactor;

        if (responseQuality >= CORRECT_ANSWER_QUALITY) {
          if (repetitions === 0) {
            updatedInterval = 1;
          } else if (repetitions === 1) {
            updatedInterval = 6;
          } else {
            updatedInterval *= easeFactor;
          }

          updatedRepetitions++;
          updatedEaseFactor = Math.max(easeFactor + 0.1, MINIMUM_EF);
        } else if (responseQuality === INCORRECT_ANSWER_QUALITY) {
          updatedRepetitions = 0;
          updatedInterval = 1;
          updatedEaseFactor = INITIAL_EF;
        }

        // Actualizar los datos de la tarjeta en Firebase
        if (
          !isNaN(updatedRepetitions) &&
          !isNaN(updatedInterval) &&
          !isNaN(updatedEaseFactor)
        ) {
          // Actualizar los datos de la tarjeta en Firebase
          await updateDoc(cardRef, {
            repetitions: updatedRepetitions,
            interval: updatedInterval,
            easeFactor: updatedEaseFactor,
          });
        } else {
          console.error(
            "Datos de tarjeta no válidos:",
            updatedRepetitions,
            updatedInterval,
            updatedEaseFactor
          );
        }
        // Devuelve los datos actualizados de la tarjeta
        return {
          ...cardData,
          repetitions: updatedRepetitions,
          interval: updatedInterval,
          easeFactor: updatedEaseFactor,
        };
      } else {
        console.error(`No se encontró ninguna tarjeta con el ID ${cardId}`);
        return null;
      }
    } catch (error) {
      console.error(
        "Error al aplicar SuperMemo y actualizar la tarjeta:",
        error
      );
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
        enrollUserInCourse,
        checkEnrollmentStatus,
        getCoursesByUserId,
        addCardToUnit,
        applySuperMemoAlgorithm,
        getCardsByUnitId,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
