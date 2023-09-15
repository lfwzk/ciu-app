import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  //ver estado de user
  const handleCange = ({ target: { name, value } }) => {
    setUser({
      ...user,
      [name]: value,
    });
  };
  //ver lo que tiene
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("El correo electrónico no está registrado.");
      } else if (error.code === "auth/wrong-password") {
        setError("La contraseña no es válida.");
      } else {
        setError("Hubo un error al interactuar con Firebase.");
      }
    }
  };
  const handleGoogleSignin = async () => {
    await loginWithGoogle();
    navigate("/");
  };

  const handleResetPassword = async () => {
    if (!user.email) return setError("Ingrese un correo electrónico.");
    try {
      await resetPassword(user.email);
      setError("Se ha enviado un correo para restablecer la contraseña.");
    } catch (error) {
      setError("Error al restablecer la contraseña.");
    }
  };

  return (
    <>
      <section className="flex flex-wrap items-center justify-center h-screen ">
        <div className="max-w-6xl mx-auto">
          <div className="lg:py-7">
            <div className="max-w-xl lg:p-12 shadow-md rounded-md p-6 mx-auto text-center bg-[#dbeafe6e] dark:bg-gray-800">
              <h1 className="mb-4 text-3xl font-bold text-gray-700 lg:mb-7 lg:text-5xl dark:text-gray-300">
                Iniciar sesion
              </h1>
              {error && <Alert message={error} />}
              <form onSubmit={handleSubmit}>
                <div className="mb-4 lg:mb-7">
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electronico"
                    onChange={handleCange}
                    className="w-full px-4 py-4 bg-white rounded-lg lg:py-5 dark:text-gray-300 dark:bg-gray-700"
                  />
                </div>
                <div className="mb-4 lg:mb-7">
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleCange}
                    className="w-full px-4 py-4 bg-white rounded-lg lg:py-5 dark:text-gray-300 dark:bg-gray-700 "
                  ></input>
                </div>
                <div className="flex items-center justify-between mb-4 lg:mb-7">
                  <a
                    href=" #"
                    className="text-sm font-semibold text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                    onClick={handleResetPassword}
                  >
                    ¿Olvidaste tu contraseña?{" "}
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-4 text-sm font-bold text-gray-300 uppercase bg-[#F14C05] rounded-md lg:text-lg dark:text-gray-300 dark:bg-[#F14C05] hover:bg-[#F14C05] dark:hover:bg-[#F14C05] "
                >
                  Iniciar sesion
                </button>
                <div className="my-3 lg:my-6">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    O inicia sesion con:
                  </span>
                </div>
                <div className="flex flex-wrap ">
                  <div className="w-full py-2 lg:px-2 lg:py-0 lg:w-1/3  items-center">
                    <button
                      onClick={handleGoogleSignin}
                      className=" w-full px-4 py-4 text-sm font-bold flex items-center justify-center  bg-red-700 rounded-md dark:bg-red-700 hover:bg-red-500 dark:hover:bg-gray-800"
                    >
                      <span className="inline-block mr-2 text-gray-300 dark:text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-google"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"></path>
                        </svg>
                      </span>
                      <span className="text-xs font-medium text-gray-200 uppercase lg:text-sm dark:text-gray-300">
                        Google
                      </span>
                    </button>
                  </div>
                  <p className="px-2 mt-6 text-sm text-left text-gray-700 dark:text-gray-400">
                    No tienes una cuenta?
                    <Link
                      to="/register"
                      className="ml-2 text-base font-semibold text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                    >
                      Registrate
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
