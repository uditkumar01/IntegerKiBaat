import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import MessageList from "../MessageList";
import "./Messenger.css";
import SideBar from "../SideBar";
import SideBarSm from "../SideBarSm";
import UserInfoBar from "../UserInfoBar";
import FormField from "../FormField";
import BlockButton from "../BlockButton";
import NavBar from "../NavBar";

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
    const [users, setUsers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [admin, setAdmin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sideBarOpen, setSideBarOpen] = useState(true);
    const [userBarOpen, setUserBarOpen] = useState(false);
    // console.log(getParticipantDetails(users, participants), participants,"yoyo");
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

    return !roomId ? (
        <RoomMenu
            setRoomId={setRoomId}
            setParticipants={setParticipants}
            setAdmin={setAdmin}
        />
    ) : (
        <div
            className={`messenger ${sideBarOpen ? "leftbar-lg" : "leftbar-sm"}`}
        >
            <div
                className="scrollable sidebar"
                style={sideBarOpen ? { width: "360px" } : { width: "70px" }}
            >
                {sideBarOpen ? (
                    <SideBar
                        sideBarOpen={sideBarOpen}
                        setSideBarOpen={setSideBarOpen}
                        setUserBarOpen={setUserBarOpen}
                        participants={getParticipantDetails(
                            users,
                            participants
                        )}
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
                        participants={getParticipantDetails(
                            users,
                            participants
                        )}
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
                    roomId={roomId}
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
    const [currentTab, setCurrentTab] = useState(false);

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
                        (participant) =>
                            participant.userId === auth.currentUser.uid
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
        <>
            <NavBar />
            <div className={`rooms-container`}>
                <div className={`room-here`}>
                    <div className={`room-tabs`}>
                        <button
                            onClick={() =>
                                setCurrentTab((currentTab) => !currentTab)
                            }
                            className={`${currentTab ? "active" : ""}`}
                        >
                            Create Room
                        </button>
                        <button
                            onClick={() =>
                                setCurrentTab((currentTab) => !currentTab)
                            }
                            className={`${!currentTab ? "active" : ""}`}
                        >
                            Join Room
                        </button>
                    </div>
                    <div className={`room-card`}>
                        {currentTab ? (
                            <>
                                <FormField
                                    label="Room Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fieldClass={`give-border`}
                                />
                                <FormField
                                    label="Discussion Topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    fieldClass={`give-border`}
                                />
                                <BlockButton
                                    name={`create room`}
                                    disabled={isLoading || !(name)}
                                    onClick={createRoom}
                                    buttonClass={`btn-dark`}
                                    fieldClass={`give-border`}
                                />
                            </>
                        ) : (
                            <>
                                <FormField
                                    label="Room Id"
                                    value={exsistingRoomId}
                                    onChange={(e) =>
                                        setExsistingRoomId(e.target.value)
                                    }
                                    fieldClass={`give-border`}
                                />
                                <BlockButton
                                    name={`join room`}
                                    disabled={isLoading || !exsistingRoomId}
                                    
                                    onClick={joinRoom}
                                    buttonClass={`btn-dark`}
                                />
                            </>
                        )}
                        {error && (
                            <div style={{ fontColor: "red" }}>{error}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
