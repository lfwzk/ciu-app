import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export const Register = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { signup } = useAuth();
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
      await signup(user.email, user.password);
      navigate("/");
    } catch (error) {
      // console.error("Error de Firebase:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está en uso.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo electrónico no es válido.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener 6 caracteres o más.");
      } else {
        setError("Hubo un error al interactuar con Firebase.");
      }
    }
  };

  return (
    <>
      <div>
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

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </>
  );
};
