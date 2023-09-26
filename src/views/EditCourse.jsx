import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Nabvar } from "../components/Nabvar";
import { UnitForm } from "./UnitForm";
import { CardForm } from "./CardForm"; // Importa el componente del formulario de tarjetas

export const EditCourse = () => {
  const { getCourseById, updateCourse, addUnitToCourse } = useCourse();
  const { courseId } = useParams(); // Obtiene courseId de los parámetros de la URL
  const [course, setCourse] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [isUnitFormVisible, setIsUnitFormVisible] = useState(false);
  const [isCardFormVisible, setIsCardFormVisible] = useState(false);
  const [unitData, setUnitData] = useState({
    name: "",
    description: "",
    // Otros campos de la unidad...
  });

  useEffect(() => {
    // Carga el curso actual por su ID cuando se monta el componente
    const fetchCourse = async () => {
      const fetchedCourse = await getCourseById(courseId);
      console.log(fetchedCourse);
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        setUnits(fetchedCourse.units || []);
        setFormData({
          name: fetchedCourse.name,
          description: fetchedCourse.description,
          image: null,
        });
        setImageUrl(fetchedCourse.image);
      } else {
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

  const handleUnitFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llama a la función addUnitToCourse para agregar la unidad al curso
      await addUnitToCourse(courseId, unitData);
      // Limpia el formulario o realiza cualquier otra acción necesaria
      setUnitData({
        name: "",
        description: "",
        // Otros campos de la unidad...
      });
      setUnits([...units, unitData]);
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (course && formData.name.trim() !== "") {
      const updatedCourse = {
        name: formData.name,
        description: formData.description,
        image: formData.image || course.image,
        units: units, // Agrega las unidades actualizadas al curso
      };

      await updateCourse(course.id, updatedCourse);
    }
  };

  const handleOpenUnitForm = () => {
    setIsUnitFormVisible(true);
  };
  const handleOpenCardForm = () => {
    setIsCardFormVisible(true);
  };

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
          <button type="button" onClick={handleOpenUnitForm}>
            Agregar Unidad
          </button>
          <Link to={`/course`}>Regresar</Link>
        </form>
      ) : (
        <p>Cargando...</p>
      )}

      {isUnitFormVisible && (
        <UnitForm
          courseId={courseId}
          unitData={unitData}
          setUnitData={setUnitData}
          handleUnitFormSubmit={handleUnitFormSubmit}
          addUnitToCourse={addUnitToCourse}
        />
      )}

      {/* Muestra las unidades */}
      {units.length > 0 && (
        <div>
          <h3>Unidades</h3>
          <ul>
            {units.map((unit, index) => (
              <li key={index}>
                {unit.name} - {unit.description}
                {/* Mostrar otros campos de la unidad si los tienes */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
