import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import MessageList from "../MessageList";
import "./Messenger.css";
import SideBar from "../SideBar";
import SideBarSm from "../SideBarSm";
import UserInfoBar from "../UserInfoBar";

export function updateActiveFlag(participants, userId, value = false) {
  return participants.map((participant) =>
    participant.userId === userId
      ? { ...participant, active: value }
      : participant
  );
}

export function getParticipantNames(users, participants) {
  return users
    .filter(
      (user) =>
        !!participants.find((participant) => participant.userId === user.uid)
    )
    .map((user) => user.displayName);
}

export default function Messenger() {
  const [roomId, setRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [admin, setAdmin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [userBarOpen, setUserBarOpen] = useState(false);

  useEffect(() => {
    const observer = firestore
      .collection("users")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newUser = change.doc.data();
            // if (!users.find((user) => user.uid === newUser.uid)) {
            setUsers((prev) => [...prev, newUser]);
            // }
          }
        });
      });

    return () => {
      observer();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const snapshot = await firestore
        .collection("rooms")
        .where("participants", "array-contains", {
          active: false,
          userId: auth.currentUser.uid,
        })
        .get();
      if (snapshot.empty) {
        console.log("No matching documents.");
      }

      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    })();
  }, []);

  const leaveRoom = async () => {
    setIsLoading(true);
    const newParticipants = updateActiveFlag(
      participants,
      auth.currentUser.uid
    );
    await firestore.collection("rooms").doc(roomId).update({
      participants: newParticipants,
    });
    setParticipants(newParticipants);
    setRoomId("");
    setIsLoading(false);
  };

  const closeRoom = async () => {
    setIsLoading(true);
    await firestore.collection("rooms").doc(roomId).update({
      readOnly: true,
    });
    setRoomId("");
    setIsLoading(false);
  };

  return !roomId ? (
    <RoomMenu
      setRoomId={setRoomId}
      setParticipants={setParticipants}
      setAdmin={setAdmin}
    />
  ) : (
    <div className={`messenger ${sideBarOpen ? "leftbar-lg" : "leftbar-sm"}`}>
      <div
        className="scrollable sidebar"
        style={sideBarOpen ? { width: "360px" } : { width: "70px" }}
      >
        {sideBarOpen ? (
          <SideBar
            sideBarOpen={sideBarOpen}
            setSideBarOpen={setSideBarOpen}
            setUserBarOpen={setUserBarOpen}
          />
        ) : (
          <SideBarSm
            sideBarOpen={sideBarOpen}
            setSideBarOpen={setSideBarOpen}
            setUserBarOpen={setUserBarOpen}
          />
        )}
      </div>
      <div className="scrollable content">
        <MessageList
          roomId={roomId}
          isReadOnly={isReadOnly}
          setIsReadOnly={setIsReadOnly}
          setParticipants={setParticipants}
          participants={participants}
        />
      </div>
      {/* <div className="scrollable sidebar">
        Room id: {roomId}
        <h2>Participants</h2>
        <ul>
          {getParticipantNames(
            users,
            participants.filter(({ active }) => active)
          ).map((displayName) => (
            <li>{displayName}</li>
          ))}
        </ul>
        <button disabled={isLoading} onClick={leaveRoom}>
          Leave Room
        </button>
        <br />
        {admin === auth.currentUser.uid && !isReadOnly && (
          <button disabled={isLoading} onClick={closeRoom}>
            Close Room
          </button>
        )}
      </div> */}

      <div className="scrollable sidebar">
        <UserInfoBar
          userBarOpen={userBarOpen}
          setUserBarOpen={setUserBarOpen}
        />
      </div>
    </div>
  );
}

function RoomMenu({ setRoomId, setParticipants, setAdmin }) {
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
      if (doc.readOnly) return;
      const { participants, admin } = doc.data();
      const isPresent = participants.find(
        ({ userId }) => userId === auth.currentUser.uid
      );
      setAdmin(admin);
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
