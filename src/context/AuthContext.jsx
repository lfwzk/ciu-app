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
import { auth, db } from "../firebase/firebase.config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import defaultProfilePhoto from "../assets/defaultprofile.jpg";

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
  const defaultPhotoURL = defaultProfilePhoto;

  const signup = async (email, password, displayName) => {
    try {
      // Registrar con correo electrónico y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(
        "Usuario con correo y contraseña registrado:",
        userCredential.user
      );

      // Obtener el ID de usuario
      const userId = userCredential.user.uid;

      // Crear un documento en Firestore para el usuario registrado
      const userDocRef = doc(db, "users", userId);

      // Definir los datos que deseas almacenar en Firestore
      const userData = {
        name: displayName,
        email: email,
        photoURL: defaultPhotoURL,
      };
      userData.role = "estudiante";
      // Almacenar los datos en Firestore
      await setDoc(userDocRef, userData);

      console.log("Datos de usuario almacenados en Firestore con ID:", userId);

      // Devuelve el usuario registrado
      return userCredential.user;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const signupWithGoogle = async () => {
    try {
      // Crear una instancia del proveedor de autenticación de Google
      const googleProvider = new GoogleAuthProvider();

      // Iniciar el proceso de autenticación con Google
      const userCredential = await signInWithPopup(auth, googleProvider);

      // Comprobar si el usuario ya existe en Firestore
      const userId = userCredential.user.uid;
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      // Si el usuario no existe en Firestore, crea un nuevo documento
      if (!userDoc.exists()) {
        // Definir los datos que deseas almacenar en Firestore
        const userData = {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL || defaultPhotoURL,
          role: "estudiante",
        };

        // Almacenar los datos en Firestore
        await setDoc(userDocRef, userData);

        console.log(
          "Datos de usuario almacenados en Firestore con ID:",
          userId
        );
      }

      console.log("Usuario de Google registrado:", userCredential.user);

      // Devuelve el usuario registrado
      return userCredential.user;
    } catch (error) {
      console.error("Error al registrar usuario con Google:", error);
      throw error;
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

  const assignUserRole = async (userID, role) => {
    try {
      await setDoc(doc(db, "users", userID), { role }, { merge: true });
      console.log(`Rol "${role}" asignado al usuario con ID ${userID}`);
    } catch (error) {
      console.error("Error al asignar rol:", error);
    }
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
        signupWithGoogle,
        assignUserRole,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
