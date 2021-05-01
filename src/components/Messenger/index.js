import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import ConversationList from "../ConversationList";
import MessageList from "../MessageList";
import "./Messenger.css";

export function updateActiveFlag(participants, userId, value = false) {
  return participants.map((participant) =>
    participant.userId === userId
      ? { ...participant, active: value }
      : participant
  );
}

export default function Messenger(props) {
  const [roomId, setRoomId] = useState("");
  const [participants, setParticipants] = useState([]);

  const leaveRoom = async () => {
    const newParticipants = updateActiveFlag(
      participants,
      auth.currentUser.uid
    );
    await firestore.collection("rooms").doc(roomId).update({
      participants: newParticipants,
    });
    setParticipants(newParticipants);
    setRoomId("");
  };

  return !roomId ? (
    <RoomMenu setRoomId={setRoomId} setParticipants={setParticipants} />
  ) : (
    <div className="messenger">
      {/* <div className="scrollable sidebar">
        <ConversationList />
      </div> */}

      <div className="scrollable content">
        <MessageList
          roomId={roomId}
          setParticipants={setParticipants}
          participants={participants}
        />
      </div>
      <div className="scrollable sidebar">
        Room id: {roomId}
        <h2>Participants</h2>
        <ul>
          {participants
            .filter(({ active }) => active)
            .map(({ userId }) => (
              <li>{userId}</li>
            ))}
        </ul>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
    </div>
  );
}

function RoomMenu({ setRoomId, setParticipants }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [exsistingRoomId, setExsistingRoomId] = useState("");
  const [error, setError] = useState("");
  const roomsRef = firestore.collection("rooms");

  const createRoom = async () => {
    const { id } = await roomsRef.add({
      name,
      topic,
      admin: auth.currentUser.uid,
      participants: [{ userId: auth.currentUser.uid, active: true }],
    });
    setParticipants([{ userId: auth.currentUser.uid, active: true }]);
    setRoomId(id);
  };
  const joinRoom = async () => {
    // exit user from room he is present in
    const roomRef = roomsRef.doc(exsistingRoomId);
    const doc = await roomRef.get();
    if (doc.exists) {
      const { participants } = doc.data();
      const isPresent = participants.find(
        ({ userId }) => userId === auth.currentUser.uid
      );
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
      setError(" room id is invalid");
    }
  };

  // make participants array of objects with active flag and id

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
      <button onClick={createRoom}>Create Room</button>
      <h1>Join room</h1>
      <input
        type="text"
        placeholder="roomId"
        value={exsistingRoomId}
        onChange={(e) => setExsistingRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      {error && <div style={{ fontColor: "red" }}>{error}</div>}
    </div>
  );
}
