import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCourse } from "../context/CourseContext";
import { Nabvar } from "./Nabvar";
import { Footer } from "./Footer";

export const Home = () => {
  const { user, loading } = useAuth();
  const { getCoursesByUserId } = useCourse();
  const [userCourses, setUserCourses] = useState([]);

  useEffect(() => {
    // Verificar si el usuario está autenticado y obtener sus cursos si lo está
    if (user) {
      getCoursesByUserId(user.uid)
        .then((courses) => {
          setUserCourses(courses);
        })
        .catch((error) => {
          console.error("Error al obtener los cursos del usuario:", error);
        });
    }
  }, [user, getCoursesByUserId]);

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <Nabvar />
      <div className="min-h-screen bg-base-200 relative">
        <p className="text-3xl font-semibold p-10">
          Bienvenid@ {user.displayName || user.email}
        </p>
        <p className="text-2xl font-semibold p-10">Cursos matriculados</p>

        {userCourses.length === 0 ? (
          <p className="text-xl">Todavía no te has matriculado en un curso.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {userCourses.map((course) => (
              <div
                key={course.id}
                className="card card-side bg-base-100 shadow-xl  lg:card-side "
              >
                <figure>
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-auto"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="text-xl font-semibold mt-4">{course.name}</h3>
                  <p className="text-gray-600">{course.description}</p>

                  {/* Unidades del curso (si están definidas) */}
                  {course.units ? (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold">
                        Unidades del Curso:
                      </h4>
                      <ul className="list-disc list-inside">
                        {course.units.map((unit) => (
                          <li key={unit.id}>{unit.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-red-600">
                      No hay unidades disponibles para este curso.
                    </p>
                  )}

                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">
                      Continuar Aprendiendo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
