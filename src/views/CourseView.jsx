import React, { useState, useEffect } from "react";
import { useCourse } from "../context/CourseContext";
import { Nabvar } from "../components/Nabvar";
import { Footer } from "../components/Footer";

export const CourseView = () => {
  const { courses, createCourse, deleteCourse, updateCourse } = useCourse();
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [editingCourse, setEditingCourse] = useState(null);

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

  const handleEditCourse = (course) => {
    // Habilita el modo de edición y rellena los campos con la información actual del curso
    setEditingCourse(course);
    setNewCourse({
      name: course.name,
      description: course.description,
      image: course.image || null,
    });
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

  return (
    <>
      <Nabvar />
      <div>
        <h2 className="text-5xl">Lista de Cursos</h2>
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
                            className="w-full h-full object-cover"
                          />
                        </figure>
                      )}
                      <h2 className="card-title"> {course.name}</h2>{" "}
                      {course.description}
                      {/* Muestra la imagen */}
                      <div className="card-actions justify-end">
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="btn btn-error"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="btn btn-info"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ul>

        <div>
          <h2 className="text-2xl">Crea un nuevo curso</h2>
          <input
            type="text"
            placeholder="Nuevo Curso"
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
            placeholder="Descripción"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                description: e.target.value,
              })
            }
          />
          {/* Campo de entrada para cargar una imagen */}
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
          <button onClick={handleCreateCourse}>Agregar Curso</button>
        </div>
      </div>
      <Footer />
    </>
  );
};
