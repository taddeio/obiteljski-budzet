import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "../types/index";

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const googleProvider = new GoogleAuthProvider();

// Check if running in iOS standalone PWA mode
const isIOSStandalone =
  (navigator as any).standalone === true &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Always use firebaseUser.uid as id — old app didn't store the id field
          const rawData = userDocSnap.data();
          const userData: User = {
            ...(rawData as User),
            id: firebaseUser.uid,
            email: rawData.email || firebaseUser.email || "",
            displayName: rawData.displayName || firebaseUser.displayName || "User",
          };
          // Migrate: write id back if it was missing in the old app's document
          if (!rawData.id) {
            updateDoc(userDocRef, { id: firebaseUser.uid }).catch(() => {});
          }
          setUser(userData);
        } else {
          // Create a new user document if it doesn't exist
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "User",
            familyId: null,
            createdAt: Date.now(),
            photoURL: firebaseUser.photoURL || undefined,
          };
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check for redirect result from Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          // User successfully signed in via redirect
          // Auth state listener will handle the rest
        }
      })
      .catch((error) => {
        console.error("Redirect sign-in error:", error);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Prijava nije uspjela. Provjerite e-poštu i lozinku."
      );
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: result.user.uid,
        email: email,
        displayName: displayName,
        familyId: null,
        createdAt: Date.now(),
      };
      const userDocRef = doc(db, "users", result.user.uid);
      await setDoc(userDocRef, newUser);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Registracija nije uspjela. Pokušajte ponovno."
      );
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      if (isIOSStandalone) {
        // Use redirect for iOS standalone PWA
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Use popup for regular browser
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "User",
            familyId: null,
            createdAt: Date.now(),
            photoURL: firebaseUser.photoURL || undefined,
          };
          await setDoc(userDocRef, newUser);
        }
      }
    } catch (error) {
      if ((error as any).code === "auth/popup-blocked") {
        throw new Error("Pop-up je blokiran. Omogućite pop-upe u pregledniku.");
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "Google prijava nije uspjela."
      );
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Odjava nije uspjela."
      );
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Resetiranje lozinke nije uspjelo."
      );
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
};
