import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCourse } from "../context/CourseContext";
import { Nabvar } from "./Nabvar";
import { Footer } from "./Footer";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const Home = () => {
  const { user, loading } = useAuth();
  const { getCoursesByUserId } = useCourse();
  const [userCourses, setUserCourses] = useState([]);

  const notify = () => toast("Proximamente!");

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
      <div className="min-h-screen bg-base-200 relative p-10">
        <p className="text-3xl font-semibold mb-10 font-Lato">
          Bienvenid@ 🎉 {user.displayName || user.email}
        </p>

        <div className="bg-base-100 shadow-xl p-6 md:p-8 lg:p-10 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:mr-8 ">
              <Icon icon="skill-icons:rocket" width="80" height="80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-4xl font-semibold mb-4 md:mb-0">
                Nuevas características próximamente!
              </h2>
              <p className="text-base  mb-4 py-5">
                Estamos trabajando en nuevas características para mejorar tu
                experiencia de aprendizaje. Con ellas podrás practicar lo
                aprendido en los cursos y reforzar tus conocimientos.
                proximamente!
              </p>
              <div className="flex justify-end">
                <button className=" btn bg-[#4BC7E7] text-white">
                  Descubre más
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-3xl font-semibold mt-10 font-Lato py-8">
          Cursos matriculados
        </p>

        {userCourses.length === 0 ? (
          <p className="text-xl">Todavía no te has matriculado en un curso.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-10 xl:gap-12">
            {userCourses.map((course) => (
              <div key={course.id} className="relative ">
                <div className="card bg-base-100 shadow-xl p-6 relative">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-5xl font-semibold overflow-hidden overflow-ellipsis">
                        {course.name}
                      </h3>
                      <p className="text-gray-600">{course.description}</p>
                    </div>
                  </div>
                  {course.units ? (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">
                        Unidades del Curso:
                      </h4>
                      <ul className="list-disc list-inside">
                        {course.units.map((unit) => (
                          <li key={unit.id}>{unit.name}</li>
                        ))}
                      </ul>
                      <p className="text-green-500 mt-2">
                        Progreso del curso: 70%
                      </p>
                      <progress
                        className="progress progress-error w-full mt-4"
                        value="70"
                        max="100"
                      ></progress>
                    </div>
                  ) : (
                    <p className="mt-4 text-red-600">
                      No hay unidades disponibles para este curso.
                    </p>
                  )}

                  <div className="mt-6">
                    <button
                      className="btn"
                      onClick={() =>
                        document.getElementById("my_modal_3").showModal()
                      }
                    >
                      <Icon
                        icon="ep:menu"
                        color="white"
                        width="30"
                        height="30"
                      />
                    </button>
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-xl">{course.name}</h3>
                        <p>Que vas a aprender hoy? </p>

                        <div className="my-2 ">
                          <Link className="btn px-2 mx-2 " to={`/course/`}>
                            <Icon
                              icon="fluent:sticker-24-filled"
                              color="white"
                              width="30"
                              height="30"
                            />
                            Tarjetas
                          </Link>
                          <div
                            className="tooltip tooltip-open tooltip-bottom"
                            data-tip="proximamente"
                          >
                            <button
                              className="btn px-2 mx-2"
                              onClick={notify}
                              disabled="disabled"
                            >
                              <Icon
                                icon="mdi:brain"
                                color="white"
                                width="30"
                                height="30"
                              />
                              Práctica
                            </button>
                          </div>
                          <div
                            className="tooltip tooltip-open tooltip-bottom "
                            data-tip="proximamente"
                          >
                            <button
                              className="btn px-2 mx-2"
                              onClick={notify}
                              disabled="disabled"
                            >
                              <Icon
                                icon="material-symbols:timer-outline"
                                color="white"
                                width="30"
                                height="30"
                              />
                              Contrareloj
                            </button>
                          </div>
                        </div>
                      </div>
                    </dialog>
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
