import { firestore } from "./firebase";

export const createUserDocument = async (user) => {
  if (!user) return;
  // Get a reference to the location in the Firestore where the user
  // document may or may not exist and fetch user
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  //if document does not exsist create a new user document
  if (!snapshot.exists) {
    const { uid, displayName, email, photoURL } = user;
    try {
      await userRef.set({
        uid,
        displayName,
        email,
        photoURL,
      });
    } catch (error) {
      console.error("Error creating user", console.error);
    }
  }
};
