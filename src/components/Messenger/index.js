import React, { useState } from "react";
import "./Messenger.css";
import { ChatPage } from "./ChatPage";
import { RoomMenu } from "./RoomMenu";

export function updateActiveFlag(participants, userId, value = false) {
  return participants.map((participant) =>
    participant.userId === userId
      ? { ...participant, active: value }
      : participant
  );
}

export function getParticipantDetails(users, participants) {
  const participantDetails = [];
  participants.forEach((participant) => {
    const user = users.find((user) => user.uid === participant.userId);
    if (user) {
      participantDetails.push({
        _id: user.uid,
        name: user.displayName,
        user_img: user.photoURL,
        active_status: participant.active,
      });
    }
  });
  return participantDetails;
}

export default function Messenger() {
  const [roomId, setRoomId] = useState("");

  const [participants, setParticipants] = useState([]);

  const [admin, setAdmin] = useState("");

  return !roomId ? (
    <RoomMenu
      setRoomId={setRoomId}
      setParticipants={setParticipants}
      setAdmin={setAdmin}
    />
  ) : (
    <ChatPage
      participants={participants}
      admin={admin}
      roomId={roomId}
      setParticipants={setParticipants}
      setRoomId={setRoomId}
    />
  );
}
