import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { login, loginWithGoogle } = useAuth();
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

  return (
    <>
      <div>
        <h1>Iniciar sesion</h1>
        {error && <Alert message={error} />}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo Electronico: </label>
          <input
            type="email"
            name="email"
            placeholder="tucorreo@correo.com"
            onChange={handleCange}
            className="bg-black"
          />
          <label htmlFor="password">Contraseña: </label>
          <input
            type="password"
            name="password"
            placeholder="*******"
            onChange={handleCange}
            className="bg-black"
          ></input>

          <button type="submit">Iniciar sesion</button>
        </form>
        <button onClick={handleGoogleSignin}>Iniciar sesion con Google</button>
      </div>
    </>
  );
};
