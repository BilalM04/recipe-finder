// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdA-tGnkRSRjKB_YQxYkiuznlpobc2KDk",
  authDomain: "recipefinder-3e72e.firebaseapp.com",
  projectId: "recipefinder-3e72e",
  storageBucket: "recipefinder-3e72e.appspot.com",
  messagingSenderId: "526445629683",
  appId: "1:526445629683:web:50f45a24b2b6d7b119e786",
  measurementId: "G-5JQKZC7TNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication instance

export { auth };
