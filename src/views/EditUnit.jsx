import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCourse } from "../context/CourseContext";
import { Nabvar } from "../components/Nabvar";

export const EditUnit = () => {
  const { courseId, unitId } = useParams();

  const { getUnitById } = useCourse();
  const [unit, setUnit] = useState(null);
  const [showAddCards, setShowAddCards] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    // Otros campos de la unidad...
  });

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        // Utiliza el método getUnitById para obtener la unidad por su ID
        const fetchedUnit = await getUnitById(courseId, unitId);

        if (fetchedUnit) {
          setUnit(fetchedUnit);
          setFormData({
            name: fetchedUnit.name,
            description: fetchedUnit.description,
            // Otros campos de la unidad...
          });
        } else {
          console.error(`No se encontró ninguna unidad con el ID ${unitId}`);
        }
      } catch (error) {
        console.error("Error al obtener la unidad:", error);
      }
    };

    fetchUnit();
  }, [courseId, unitId, getUnitById]); // Añade courseId a las dependencias

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Nabvar />
      <div className="mx-auto max-w-lg mt-8 ">
        <h2 className="text-4xl font-bold">Unidad {unit?.name}</h2>
        {unit ? (
          <>
            <p className="text-lg mt-4 text-green-500">Descripción:</p>
            <p className="text-gray-200 ">{unit.description}</p>
            {/* Otros campos de la unidad */}
            <div className="p-10">
              <Link
                to="/course"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 "
              >
                Regresar
              </Link>
            </div>
          </>
        ) : (
          <p className="mt-4">Cargando...</p>
        )}
        {/* Botón para mostrar/ocultar las tarjetas adicionales */}
        <button
          onClick={() => setShowAddCards(!showAddCards)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          {showAddCards ? "Ocultar Cards" : "Mostrar Cards"}
        </button>

        {/* Tarjetas adicionales */}
        {showAddCards && (
          <div className="mt-4 p-4 border border-gray-300 rounded">
            {/* Aquí puedes agregar tarjetas adicionales */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Título de la Tarjeta 1</h3>
              <p>Contenido de la Tarjeta 1</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Título de la Tarjeta 2</h3>
              <p>Contenido de la Tarjeta 2</p>
            </div>
            {/* Agrega más tarjetas según sea necesario */}
          </div>
        )}
      </div>
    </>
  );
};
