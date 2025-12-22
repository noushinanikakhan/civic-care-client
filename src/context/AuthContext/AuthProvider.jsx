import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// In AuthProvider.jsx - Update the useEffect and saveUserToDB function

// ✅ Fix the saveUserToDB function
const saveUserToDB = async (currentUser) => {
  if (!currentUser?.email) return;

  const userInfo = {
    email: currentUser.email,
    name: currentUser.displayName || currentUser.email.split('@')[0],
    photoURL: currentUser.photoURL || "",
  };

  try {
    const response = await fetch("https://civic-care-server.vercel.app/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    console.log("User saved to DB:", data);
    return data;
  } catch (error) {
    console.error("Failed to save user:", error);
    throw error; // Re-throw to handle in caller
  }
};

// ✅ Fix the useEffect
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    // ✅ If logged in, sync to Mongo (won't overwrite photoURL now)
    if (currentUser?.email) {
      try {
        await saveUserToDB(currentUser);
      } catch (e) {
        console.error("Mongo sync failed:", e);
      }
    }
  });

  return () => unsubscribe();
}, []);



  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    googleSignIn,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
