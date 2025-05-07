import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIkQRycpZUqXwZHme_1pP5eHp0qYifm0Y",
  authDomain: "zentasker-1e20e.firebaseapp.com",
  projectId: "zentasker-1e20e",
  storageBucket: "zentasker-1e20e.firebasestorage.app",
  messagingSenderId: "914551007182",
  appId: "1:914551007182:web:b50b80d61391f4040f2d9f",
  measurementId: "G-LEMMLX654W"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Authentication
const auth = getAuth(app);

export { auth };