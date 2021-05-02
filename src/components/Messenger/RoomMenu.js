import React, { useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import { updateActiveFlag } from "./index";

export function RoomMenu({ setRoomId, setParticipants, setAdmin }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [exsistingRoomId, setExsistingRoomId] = useState("");
  const [error, setError] = useState("");
  const roomsRef = firestore.collection("rooms");
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async () => {
    setIsLoading(true);
    const { id } = await roomsRef.add({
      name,
      topic,
      admin: auth.currentUser.uid,
      participants: [{ userId: auth.currentUser.uid, active: true }],
    });
    setParticipants([{ userId: auth.currentUser.uid, active: true }]);
    setAdmin(auth.currentUser.uid);
    setRoomId(id);
    setIsLoading(false);
  };
  const joinRoom = async () => {
    // exit user from room he is present in
    setIsLoading(true);
    const roomRef = roomsRef.doc(exsistingRoomId);
    const doc = await roomRef.get();
    if (doc.exists) {
      const { participants, admin } = doc.data();
      const isPresent = participants.find(
        ({ userId }) => userId === auth.currentUser.uid
      );
      setAdmin(admin);

      // remove user from rooms he is already present in
      const snapshot = await firestore
        .collection("rooms")
        .where("participants", "array-contains", {
          active: true,
          userId: auth.currentUser.uid,
        })
        .get();
      if (!snapshot.empty) {
        snapshot.forEach(async (doc) => {
          // console.log(doc.id, "=>", doc.data());
          const { participants } = doc.data();
          const index = participants.findIndex(
            (participant) => participant.userId === auth.currentUser.uid
          );
          participants[index].active = false;
          await firestore
            .collection("rooms")
            .doc(doc.id)
            .update({ participants });
        });
      }

      let newParticipants;
      if (!isPresent) {
        newParticipants = participants.concat({
          userId: auth.currentUser.uid,
          active: true,
        });
      } else {
        newParticipants = updateActiveFlag(
          participants,
          auth.currentUser.uid,
          true
        );
      }
      await roomRef.update({ participants: newParticipants });

      setParticipants(newParticipants);
      setRoomId(exsistingRoomId);
    } else {
      setError("room id is invalid");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Set up a room</h1>
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button isDisaled={isLoading} onClick={createRoom}>
        Create Room
      </button>
      <h1>Join room</h1>
      <input
        type="text"
        placeholder="roomId"
        value={exsistingRoomId}
        onChange={(e) => setExsistingRoomId(e.target.value)}
      />
      <button disabled={isLoading} onClick={joinRoom}>
        Join Room
      </button>
      {error && <div style={{ fontColor: "red" }}>{error}</div>}
    </div>
  );
}
