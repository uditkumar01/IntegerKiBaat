import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import MessageList from "../MessageList";
import SideBar from "../SideBar";
import SideBarSm from "../SideBarSm";
import UserInfoBar from "../UserInfoBar";
import { updateActiveFlag, getParticipantDetails } from "./index";

export function ChatPage({
  participants,
  admin,
  roomId,
  setParticipants,
  setRoomId,
}) {
  const [users, setUsers] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [userBarOpen, setUserBarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 750) {
      setSideBarOpen(false);
    }
  }, []);

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

  return (
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
            participants={getParticipantDetails(users, participants)}
            closeRoom={closeRoom}
            leaveRoom={leaveRoom}
            isLoading={isLoading}
            isAdmin={admin === auth.currentUser.uid}
          />
        ) : (
          <SideBarSm
            sideBarOpen={sideBarOpen}
            setSideBarOpen={setSideBarOpen}
            setUserBarOpen={setUserBarOpen}
            isLoading={isLoading}
            participants={getParticipantDetails(users, participants)}
            closeRoom={closeRoom}
            leaveRoom={leaveRoom}
            isAdmin={admin === auth.currentUser.uid}
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

      <div className="scrollable sidebar">
        <UserInfoBar
          userBarOpen={userBarOpen}
          setUserBarOpen={setUserBarOpen}
        />
      </div>
    </div>
  );
}
