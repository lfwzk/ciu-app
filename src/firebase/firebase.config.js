import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxJWohGXGjik8AgL9pthfBoztES0fAUV8",
  authDomain: "ciu-app-9016c.firebaseapp.com",
  projectId: "ciu-app-9016c",
  storageBucket: "ciu-app-9016c.appspot.com",
  messagingSenderId: "351368366845",
  appId: "1:351368366845:web:5631a260708be65304cc94",
  measurementId: "G-2XBZZRMX6B",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); // Asegúrate de que 'app' sea la instancia correcta de Firebase

export { app, auth, db };
