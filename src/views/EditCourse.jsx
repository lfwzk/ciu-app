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

      <div className="container mx-auto p-6">
        <h2 className="text-5xl mb-6">Editar Curso - {formData.name}</h2>
        {imageUrl && (
          <div className="mb-6 text-center">
            <label className="block mb-2">Imagen Actual</label>
            <img
              src={imageUrl}
              alt="Imagen del curso"
              className="h-80 w-auto rounded-lg mx-auto shadow-lg"
            />
          </div>
        )}

        {course ? (
          <form>
            <div className="mb-4">
              <label className="block mb-2">Nombre del Curso</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Descripción</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Imagen</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFormChange}
                className="border rounded-md p-2"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-2"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={handleOpenUnitForm}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2"
            >
              Agregar Unidad
            </button>
            <Link to={`/course`} className="text-blue-500 hover:underline">
              Regresar
            </Link>
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
          <div className=" backdrop-blur-lg p-4 rounded-md shadow-md">
            <h3 className="text-3xl mb-4 font-semibold text-white">Unidades</h3>
            <ul className="space-y-2">
              {units.map((unit, index) => (
                <li
                  key={index}
                  className="p-4  bg-opacity-80 rounded-md shadow-md flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-2xl font-semibold ">{unit.name}</h4>
                    <p className="text-gray-200">
                      {" "}
                      <p className="text-green-500">Descripcion:</p>
                      <br />
                      {unit.description}
                    </p>
                    {/* Mostrar otros campos de la unidad si los tienes */}
                  </div>
                  <Link
                    to={`/course/${courseId}/units/${unit.id}/edit`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                  >
                    Detalles
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
