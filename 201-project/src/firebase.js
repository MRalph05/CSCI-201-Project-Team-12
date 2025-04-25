import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCchC0gIROjHmNL1RWErn4DteZLo12tYg4",
  authDomain: "project-e3c10.firebaseapp.com",
  projectId: "project-e3c10",
  storageBucket: "project-e3c10.firebasestorage.app",
  messagingSenderId: "819317305134",
  appId: "1:819317305134:web:14c658c8a5c50c6f5a94bf",
  measurementId: "G-QY7WLVET3D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
