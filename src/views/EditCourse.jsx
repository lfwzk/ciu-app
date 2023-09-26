import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Nabvar } from "../components/Nabvar";

export const EditCourse = () => {
  const { getCourseById, updateCourse } = useCourse();
  const { courseId } = useParams(); // Obtiene courseId de los parámetros de la URL
  const [course, setCourse] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    // Carga el curso actual por su ID cuando se monta el componente
    const fetchCourse = async () => {
      const fetchedCourse = await getCourseById(courseId);
      console.log(fetchedCourse);
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        setFormData({
          name: fetchedCourse.name,
          description: fetchedCourse.description,
          image: null, // Si deseas mostrar la imagen actual, puedes establecerla aquí
        });
        setImageUrl(fetchedCourse.image); // Agrega esta línea
      } else {
        // Maneja el caso en el que no se encuentra el curso
        console.error(`No se encontró ningún curso con el ID ${courseId}`);
      }
    };

    fetchCourse();
  }, [courseId, getCourseById]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleSaveChanges = async () => {
    // Asegúrate de que se haya seleccionado un curso y los campos no estén vacíos
    if (course && formData.name.trim() !== "") {
      // Crea un objeto con los campos actualizados
      const updatedCourse = {
        name: formData.name,
        description: formData.description,
        image: formData.image || course.image, // Mantén la imagen existente si no se ha seleccionado una nueva
      };

      // Actualiza el curso en la base de datos
      await updateCourse(course.id, updatedCourse);

      // Redirige o realiza cualquier otra acción después de guardar los cambios
    }
  };
  if (!courseId) {
    // Maneja el caso en el que courseId no tiene un valor válido
    console.error("courseId no es válido:", courseId);
    return;
  }

  return (
    <div>
      <Nabvar />
      <h2>Editar Curso</h2>
      {imageUrl && (
        <div>
          <label>Imagen Actual</label>
          <img src={imageUrl} alt="Imagen del curso" className="h-40 w-40" />
        </div>
      )}
      {course ? (
        <form>
          <div>
            <label>Nombre del Curso</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label>Descripción</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label>Imagen</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFormChange}
            />
          </div>
          <button type="button" onClick={handleSaveChanges}>
            Guardar Cambios
          </button>
          <Link to={`/course`}>Regresar</Link>
        </form>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};
