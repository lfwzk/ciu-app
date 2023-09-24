import React from "react";
import { useAuth } from "../context/AuthContext";

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

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/">Home </a>
              </li>
              <li>
                <a>Progress</a>
              </li>
              <li>
                <a href="/course">Courses</a>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">
              Hola{" "}
              {truncateDisplayName(displayName) || removeEmailDomain(email)}
            </a>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a> Progress</a>
            </li>
            <li>
              <a href="/course">Courses</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={photoURL} alt="User Avatar" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
