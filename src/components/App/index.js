import React, { useEffect, useState } from "react";
import firebase, { auth } from "../../firebase/firebase";
import { createUserDocument } from "../../firebase/users";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Messenger from "../Messenger";
import { ToastContainer } from "react-toastify";
import { ChatPage } from "../Messenger/ChatPage";

function PrivateRoute({ isSignedIn, path, ...props }) {
  return isSignedIn ? (
    <Route {...props} path={path} />
  ) : (
    <Navigate state={{ from: path }} replace to="/signin" />
  );
}

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const observer = auth.onAuthStateChanged(function (user) {
      if (user) {
        setIsSignedIn(true);
        createUserDocument(user);
        console.log("hello");
        // navigate("/");
      }
    });
    return () => {
      observer();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <PrivateRoute
          isSignedIn={isSignedIn}
          path="/"
          element={<Messenger />}
        />
        <Route path="/signin" element={<SignIn />} />
        <PrivateRoute
          isSignedIn={isSignedIn}
          path="/room/:roomId"
          element={<ChatPage />}
        />
      </Routes>
      {/* {!isSignedIn ?  : } */}
    </div>
  );
}

function SignIn() {
  // const navigate = useNavigate();
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    // navigate("/");
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
