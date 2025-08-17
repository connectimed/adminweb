"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname, redirect } from "next/navigation";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [firebaseUser, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [fireLoaded, setFireLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUserData = async (id) => {
    const userDoc = doc(collection(db, "Users"), id);
    const docSnapshot = await getDoc(userDoc);
    if (docSnapshot.exists()) {
      setUserData(docSnapshot.data());
      console.log("document exists!");
    } else {
      console.log("No such document!");
    }
  };

  // useEffect(() => {
  //   fetchUserData("settings");
  // }, []);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setUserData(null);
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  useEffect(() => {
    const isItLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    setIsLocalhost(isItLocal);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This function will be called whenever the authentication state changes
      if (user) {
        // User is signed in
        if (pathname === "/sign-in") {
          router.push("/");
        }
        setUser(user);
        fetchUserData(user.uid);
        // console.log("firebase user:", user);
      } else {
        // User is signed out
        setFireLoaded(true);
        setUser(null);
        console.log("firebase user is out:");
        if (pathname !== "/sign-in") {
          router.push("/sign-in");
        }
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        fireLoaded,
        isLocalhost,
        fetchUserData,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
