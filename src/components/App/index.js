import React from "react";
import firebase, { auth } from "../../firebase/firebase";
import { createUserDocument } from "../../firebase/users";

import Messenger from "../Messenger";

export default function App() {
  const user = auth.currentUser;
  return <div className="App">{!user ? <SignIn /> : <Messenger />}</div>;
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    createUserDocument(auth.currentUser);
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
