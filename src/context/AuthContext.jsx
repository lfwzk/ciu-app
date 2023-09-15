import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado de usuario global, inicialmente nulo
  const [loading, setLoading] = useState(true); // Estado de carga global, inicialmente verdadero

  const signup = async (email, password, name) => {
    //console.log(email, password, repeatpassword);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        name,
        password
      );
      // Puedes realizar acciones adicionales aquí si es necesario, como almacenar datos de usuario en el estado global.
      return userCredential.user; // Devuelve el objeto de usuario si el registro es exitoso
    } catch (error) {
      throw error; // Propaga el error para que los componentes puedan manejarlo
    }
  };

  const login = async (email, password) => {
    try {
      signInWithEmailAndPassword(auth, email, password);
      // Puedes realizar acciones adicionales aquí si es necesario
    } catch (error) {
      throw error; // Propaga el error para que los componentes puedan manejarlo
    }
  };

  const logout = () => signOut(auth);

  const loginWithGoogle = () => {
    const googleprovider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleprovider);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  useEffect(() => {
    const unsuscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); // Establece el estado de carga en falso, independientemente de si el usuario es nulo o no
    });
    return () => unsuscribed();
  }, []);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
