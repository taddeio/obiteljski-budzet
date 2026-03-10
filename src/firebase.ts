import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUfqZ0XjCfFwYvXo8Bx7TnwJy5ustU0ZI",
  authDomain: "obiteljski-budzet.firebaseapp.com",
  projectId: "obiteljski-budzet",
  storageBucket: "obiteljski-budzet.firebasestorage.app",
  messagingSenderId: "442640773685",
  appId: "1:442640773685:web:199a260903945ff47b377c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and enable persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to enable auth persistence:", error);
});

// Initialize Firestore and enable offline persistence
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((error) => {
  if (error.code === "failed-precondition") {
    console.warn("Multiple tabs open, persistence disabled");
  } else if (error.code === "unimplemented") {
    console.warn("Firestore persistence not available in this environment");
  }
});

export default app;
