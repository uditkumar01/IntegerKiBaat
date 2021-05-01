import React, { useEffect, useState } from "react";
import firebase, { auth } from "../../firebase/firebase";
import { createUserDocument } from "../../firebase/users";

import Messenger from "../Messenger";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setIsSignedIn(true);
        createUserDocument(user);
      }
    });
  }, []);

  return <div className="App">{!isSignedIn ? <SignIn /> : <Messenger />}</div>;
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
