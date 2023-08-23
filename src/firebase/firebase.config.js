// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
