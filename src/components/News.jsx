import React from "react";

import { Link } from "react-router-dom";
import { Nabvar } from "./Nabvar";
import { Footer } from "./Footer";

export const News = () => {
  return (
    <>
      <Nabvar />
      <div className="min-h-screen bg-base-200 p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            Proximamente en la Plataforma
          </h2>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              Nuevos Módulos de Aprendizaje
            </h3>
            <ul className="list-disc list-inside">
              <li>🚀 Introducción al Vocabulario Esencial</li>
              <li>
                🔊 Pronunciación Avanzada: ¡Domina los Sonidos del Inglés!
              </li>
              <li>📚 Lecturas Interactivas para Mejorar la Comprensión</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Mejoras en la Experiencia de Usuario
            </h3>
            <ul className="list-disc list-inside">
              <li>🎉 Nuevo Diseño de Tarjetas de Aprendizaje</li>
              <li>📈 Seguimiento de Progreso Mejorado</li>
              <li>🔍 Búsqueda Rápida de Cursos y Unidades</li>
            </ul>
          </div>

          <div className="mt-8">
            <Link to="/home" className="btn bg-[#4BC7E7] text-white">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
