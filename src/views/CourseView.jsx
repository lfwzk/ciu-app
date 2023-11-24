import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import { Nabvar } from "../components/Nabvar";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";

export const CourseView = () => {
  const {
    courses,
    createCourse,
    enrollUserInCourse,
    checkEnrollmentStatus,
    deleteCourse,
  } = useCourse();
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const { user: currentUser } = useAuth();

  // Limpia los campos de creación cuando se inicia el modo de edición
  useEffect(() => {
    if (editingCourse !== null) {
      setNewCourse({
        name: editingCourse.name,
        description: editingCourse.description,
      });
    } else {
      setNewCourse({
        name: "",
        description: "",
      });
    }
  }, [editingCourse]);

  const handleCreateCourse = async () => {
    if (newCourse.name.trim() !== "") {
      await createCourse(newCourse);
      setNewCourse({
        name: "",
        description: "",
        image: null,
      });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      await deleteCourse(courseId);
    }
  };

  const handleUpdateCourse = async () => {
    if (newCourse.name.trim() !== "" && editingCourse !== null) {
      await updateCourse(editingCourse.id, newCourse);
      setEditingCourse(null); // Deshabilita el modo de edición
      setNewCourse({
        name: "",
        description: "",
        image: null,
      });
    }
  };
  const handleEnrollCourse = async (courseId) => {
    if (currentUser) {
      const userId = currentUser.uid; // Obtiene el ID del usuario actual
      try {
        // Llama a enrollUserInCourse con el ID del usuario actual y el ID del curso
        await enrollUserInCourse(userId, courseId);
        toast.success("Usuario matriculado en el curso");

        console.log("Usuario matriculado en el curso");
        // Realiza cualquier otra acción después de la matriculación
      } catch (error) {
        toast.error("Error al matricular al usuario en el curso");
        console.error("Error al matricular al usuario en el curso:", error);
      }
    } else {
      // El usuario no está autenticado, puedes mostrar un mensaje o redirigirlo a la página de inicio de sesión
    }
  };
  const isUserEnrolled = (courseId) => {
    if (currentUser) {
      // Verifica si el usuario está matriculado en el curso actual
      return checkEnrollmentStatus(currentUser.uid, courseId);
    }
    return false; // El usuario no está autenticado, por lo que no puede estar matriculado
  };

  return (
    <>
      <Nabvar />
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <h1 className=" text-5xl font-lato px-10 font-bold">Cursos </h1>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Buscar curso"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <div className="dropdown dropdown-end">
            <div className="p-5">
              {/* You can open the modal using document.getElementById('ID').showModal() method */}
              <button
                className="btn bg-green-500 text-white  p-2 rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Crear un nuevo curso{" "}
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-2xl py-2 text-ciu">
                    Crear un nuevo curso{" "}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto">
                    <input
                      type="text"
                      placeholder="Nuevo Curso"
                      value={newCourse.name}
                      className="input input-bordered input-info w-full"
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          name: e.target.value,
                        })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Descripción"
                      className="input input-bordered input-info w-full"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                    />

                    <div className="relative w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered file-input-info w-full"
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            image: e.target.files[0],
                          })
                        }
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        📷
                      </span>
                    </div>

                    <button
                      onClick={handleCreateCourse}
                      className="btn bg-blue-500 text-white w-full"
                    >
                      Agregar Curso
                    </button>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 font-lato">
        <div className="bg-base-100 shadow-xl p-6 md:p-8 lg:p-10 rounded-lg ">
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
                <a className=" btn bg-[#4BC7E7] text-white" href="/news">
                  Descubre más
                </a>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-5xl p-5 font-bold">Cursos creados</h2>
        <ul>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-19">
            {courses.map((course) => (
              <div key={course.id} className="card bg-base-100 shadow-xl">
                {editingCourse && editingCourse.id === course.id ? (
                  <>
                    <input
                      type="text"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          name: e.target.value,
                        })
                      }
                    />

                    <input
                      type="text"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                    />

                    <input
                      type="file"
                      className="file-input w-full max-w-xs"
                      accept="image/*"
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          image: e.target.files[0],
                        })
                      }
                    />

                    {/* Muestra la imagen */}
                    {course.image instanceof Blob && (
                      <>
                        <img
                          src={URL.createObjectURL(course.image)}
                          alt="Imagen del curso"
                          width="100"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              image: e.target.files[0],
                            })
                          }
                        />
                      </>
                    )}

                    <button
                      onClick={handleUpdateCourse}
                      className="btn btn-primary"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <div className="card-body">
                      {course.image && typeof course.image === "string" && (
                        <figure className="w-full h-64 sm:h-80 flex items-center justify-center">
                          {" "}
                          <img
                            src={course.image}
                            alt="Imagen del curso"
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </figure>
                      )}
                      <h2 className="card-title">
                        {" "}
                        <Icon
                          icon="emojione:flag-for-united-states"
                          width="30"
                          height="30"
                        />
                        {course.name}{" "}
                      </h2>{" "}
                      {course.description}
                      {/* Muestra la imagen */}
                      <div className="card-actions justify-end">
                        {/* _______________________________ */}
                        <div className="dropdown ">
                          <label tabIndex={0} className="btn m-1">
                            <Icon
                              icon="ep:menu"
                              color="white"
                              width="30"
                              height="30"
                            />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 "
                          >
                            <li>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="btn btn-error  "
                              >
                                Eliminar
                              </button>
                            </li>
                            <li>
                              <Link
                                to={`/course/${course.id}`}
                                className="btn btn-info"
                              >
                                Editar
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* ________________________________ */}

                        {/* Enlace para editar */}

                        <button
                          onClick={() => handleEnrollCourse(course.id)}
                          className="btn btn-success"
                        >
                          {isUserEnrolled(course.id)
                            ? "Matricularse "
                            : "Matricularse"}
                        </button>
                        <Toaster />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ul>
      </div>
      <Footer />
    </>
  );
};
