import { useAuth } from "../context/AuthContext";
import { Nabvar } from "./Nabvar";
import { Footer } from "./Footer";

export const Home = () => {
  const { user, logout, loading } = useAuth();

  //console.log(user);
  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <Nabvar />
      <div className="hero min-h-screen bg-base-200">
        <div className="max-w-md">
          <p className="p-10">Hello {user.displayName || user.email} </p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      <Footer />
    </>
  );
};
