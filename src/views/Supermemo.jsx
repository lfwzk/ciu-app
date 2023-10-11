import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { useParams, Link } from "react-router-dom";
import { Nabvar } from "../components/Nabvar";

export const SuperMemo = () => {
  const { applySuperMemoAlgorithm, getCardsByUnitId } = useCourse();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);
  const { courseId, unitId } = useParams();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Obtener las tarjetas por unidad
        const fetchedCards = await getCardsByUnitId(courseId, unitId);
        setCards(
          fetchedCards.map((card) => ({
            ...card,
            easeFactor: isNaN(card.easeFactor) ? 2.5 : card.easeFactor,
            interval: isNaN(card.interval) ? 1 : card.interval || 1,
            repetitions: isNaN(card.repetitions) ? 0 : card.repetitions || 0,
          }))
        );
      } catch (error) {
        console.error("Error al cargar las tarjetas:", error);
      }
    };

    fetchCards();
  }, [courseId, unitId]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleResponse = async (responseQuality) => {
    try {
      const currentCard = cards[currentCardIndex];

      if (
        currentCard &&
        !isNaN(currentCard.repetitions) &&
        !isNaN(currentCard.interval) &&
        !isNaN(currentCard.easeFactor)
      ) {
        // Aplicar el algoritmo de SuperMemo
        const updatedCard = await applySuperMemoAlgorithm(
          courseId,
          unitId,
          currentCard.id,
          responseQuality
        );

        if (
          updatedCard &&
          !isNaN(updatedCard.repetitions) &&
          !isNaN(updatedCard.interval) &&
          !isNaN(updatedCard.easeFactor)
        ) {
          // Actualizar el estado local con la tarjeta actualizada
          const updatedCards = [...cards];
          updatedCards[currentCardIndex] = updatedCard;
          setCards(updatedCards);

          // Mostrar la próxima tarjeta después de un breve retraso
          setTimeout(() => {
            setShowAnswer(false);
            const nextCardIndex = currentCardIndex + 1;
            if (nextCardIndex < updatedCards.length) {
              setCurrentCardIndex(nextCardIndex);
            } else {
              setFinished(true);
            }
          }, 1000);
        } else {
          console.error("Datos de tarjeta no válidos:", updatedCard);
        }
      } else {
        console.error("Datos de tarjeta actual no válidos:", currentCard);
      }
    } catch (error) {
      console.error("Error al manejar la respuesta:", error);
    }
  };

  return (
    <>
      <Nabvar />
      <div className="p-8 border rounded-lg shadow-lg">
        {finished ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              ¡Felicidades! Has completado todas las tarjetas de aprendizaje.
            </h1>
            <p>Vuelve a la pantalla principal para explorar más contenido.</p>
            <Link to="/" className="text-blue-500 hover:underline mt-4 block">
              Volver a la pantalla principal
            </Link>
          </div>
        ) : (
          <div>
            {cards.length > 0 && currentCardIndex < cards.length && (
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  Repetición Espaciada
                </h1>
                <div className="mb-4">
                  <strong className="font-semibold">Pregunta:</strong>{" "}
                  {cards[currentCardIndex].question}
                </div>
                {showAnswer && (
                  <div className="mb-4">
                    <strong className="font-semibold">Respuesta:</strong>{" "}
                    {cards[currentCardIndex].answer}
                  </div>
                )}
                {!showAnswer && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleShowAnswer}
                  >
                    Mostrar Respuesta
                  </button>
                )}
                <div className="mt-4 space-x-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleResponse(5)}
                  >
                    Fácil
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleResponse(3)}
                  >
                    Medio
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleResponse(1)}
                  >
                    Difícil
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
