import React, { useEffect, useState } from "react";
import firebase, { auth } from "../../firebase/firebase";
import { createUserDocument } from "../../firebase/users";
import "./App.css";

import Messenger from "../Messenger";
import { ToastContainer } from "react-toastify";
import Home from "../Home";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const observer = auth.onAuthStateChanged(function (user) {
      if (user) {
        setIsSignedIn(true);
        createUserDocument(user);
      }
    });
    return () => {
      observer();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      {!isSignedIn ? <SignIn /> : <Messenger />}
      {/* <Home /> */}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

export function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}
