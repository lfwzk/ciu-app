import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import img1 from "../assets/CIU.png";
import {
  FiMenu,
  FiHome,
  FiBarChart2,
  FiBookOpen,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export const Nabvar = () => {
  const { user, logout } = useAuth();
  //console.log(user);

  const handleLogout = async () => {
    await logout();
  };

  const truncateDisplayName = (displayName) => {
    if (displayName && displayName.length > 20) {
      return displayName.substring(0, 13) + "...";
    }
    return displayName;
  };

  const removeEmailDomain = (email) => {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    }
    return email;
  };

  const displayName = user?.displayName || ""; // Usamos el operador de opcional para acceder a las propiedades
  const email = user?.email || "";
  const photoURL = user?.photoURL || ""; // Asegurarse de que photoURL esté definido
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="navbar bg-[#4BC7E7]  text-white ">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={toggleMenu}
            >
              <FiMenu className="h-5 w-5" />
            </label>
            {isOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/">
                    <FiHome className="mr-2" />
                    Home
                  </Link>
                </li>
                <li>
                  <a>
                    <FiBarChart2 className="mr-2" />
                    Progress
                  </a>
                </li>
                <li>
                  <Link to="/course">
                    <FiBookOpen className="mr-2" />
                    Courses
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="flex-1">
            <Link className="btn btn-ghost normal-case text-xl" to="/">
              <img src={img1} alt="" className="w-48 h-auto rounded-md" />{" "}
              {/* Utiliza las clases w-24 para el ancho y h-auto para la altura */}
            </Link>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex text-2xl">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">
                <FiHome className="mr-2 " />
                Home
              </Link>
            </li>
            <li>
              <a>
                <FiBarChart2 className="mr-2" />
                Progress
              </a>
            </li>
            <li>
              <Link to="/course">
                <FiBookOpen className="mr-2" />
                Courses
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                onClick={toggleMenu}
              >
                <div className="w-10 rounded-full">
                  <img src={photoURL} alt="User Avatar" />
                </div>
              </label>
              {isOpen && (
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a>
                      <FiUser className="mr-2" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a>
                      <FiSettings className="mr-2" />
                      Settings
                    </a>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      <FiLogOut className="mr-2" />
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
