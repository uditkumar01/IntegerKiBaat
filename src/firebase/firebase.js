import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCcXWQReht918Po67VAiz2OroRmq2o0YUY",
  authDomain: "integer-ki-chat.firebaseapp.com",
  projectId: "integer-ki-chat",
  storageBucket: "integer-ki-chat.appspot.com",
  messagingSenderId: "53394771893",
  appId: "1:53394771893:web:59721e129d4c7f627e93fc",
  measurementId: "G-7ETYQ0C219",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();

export default firebase;
