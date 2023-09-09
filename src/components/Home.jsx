import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user, logout, loading } = useAuth();

  //console.log(user);
  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <div>
        <p>Hello {user.displayName || user.email} </p>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </>
  );
};
