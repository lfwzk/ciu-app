import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCourse } from "../context/CourseContext";
import { Nabvar } from "../components/Nabvar";

export const EditUnit = () => {
  const { courseId, unitId } = useParams();
  const {
    getUnitById,
    addCardToUnit,
    getCardById,
    updateCardInUnit,
    deleteCardFromUnit,
  } = useCourse();
  const [unit, setUnit] = useState(null);
  const [showAddCards, setShowAddCards] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    // Otros campos de la unidad...
  });
  const [cardForm, setCardForm] = useState({
    question: "",
    answer: "",
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
    setCardForm({
      ...cardForm,
      [name]: value,
    });
  };

  const handleAddCard = async () => {
    try {
      // Llama a la función addCardToUnit para agregar la tarjeta a la unidad actual
      await addCardToUnit(courseId, unitId, cardForm);

      // Actualiza el estado local para reflejar los cambios
      const updatedUnit = await getUnitById(courseId, unitId);
      setUnit(updatedUnit);

      // Limpia el formulario después de agregar la tarjeta
      setCardForm({
        question: "",
        answer: "",
      });
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
    }
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
            <div className="mt-4 p-4 border border-gray-300 rounded">
              <h2 className="text-xl font-semibold mb-4">Agregar Tarjeta</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Pregunta
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={cardForm.question}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Respuesta
                  </label>
                  <input
                    type="text"
                    name="answer"
                    value={cardForm.answer}
                    onChange={handleFormChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agregar Tarjeta
                </button>
              </form>
            </div>
            {/* Mapea las tarjetas de la unidad */}
            {unit.cards && unit.cards.length > 0 ? (
              unit.cards.map((card) => (
                <div key={card.id} className="mb-4">
                  <h3 className="text-xl font-semibold">{card.question}</h3>
                  <p>{card.answer}</p>
                  {/* Agrega botones para editar y eliminar la tarjeta según sea necesario */}
                </div>
              ))
            ) : (
              <p>No hay tarjetas disponibles en esta unidad.</p>
            )}

            {/* Botón para agregar una nueva tarjeta */}
          </div>
        )}
      </div>
    </>
  );
};
