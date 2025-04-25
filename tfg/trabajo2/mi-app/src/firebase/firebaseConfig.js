// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AlzaSyBlkQRycpZUQxWZHme_1pP5eHp0QyYifm0Y",
  authDomain: "zentasker-1e20e.firebaseapp.com",
  projectId: "zentasker-1e20e",
  storageBucket: "zentasker-1e20e.appspot.com",
  messagingSenderId: "914551007182",
  appId: "1:914551007182:web:b50b80d61391f4040f2d9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
