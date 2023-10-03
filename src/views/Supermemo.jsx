import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { useParams } from "react-router-dom";

export const SuperMemo = () => {
  const { applySuperMemoAlgorithm, getCardsByUnitId } = useCourse();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
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
            interval: isNaN(card.interval) ? 1 : card.interval || 1, // Establecer en 1 si interval es undefined
            repetitions: isNaN(card.repetitions) ? 0 : card.repetitions || 0, // Establecer en 0 si repetitions es undefined
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

      // Verificar si currentCardIndex está dentro del rango válido
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

        // Verificar si updatedCard es válido
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
              console.log("No hay más tarjetas para mostrar.");
            }
          }, 1000); // Cambia este valor si deseas ajustar la duración de la respuesta mostrada
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
    <div>
      {cards.length > 0 && currentCardIndex < cards.length && (
        <div>
          <h1>Repetición Espaciada</h1>
          <div>
            <strong>Pregunta:</strong> {cards[currentCardIndex].question}
          </div>
          {showAnswer && (
            <div>
              <strong>Respuesta:</strong> {cards[currentCardIndex].answer}
            </div>
          )}
          {!showAnswer && (
            <button onClick={handleShowAnswer}>Mostrar Respuesta</button>
          )}
          <div>
            <button onClick={() => handleResponse(5)}>Fácil</button>
            <button onClick={() => handleResponse(3)}>Medio</button>
            <button onClick={() => handleResponse(1)}>Difícil</button>
          </div>
        </div>
      )}
    </div>
  );
};
