import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";
import "./MessageList.css";
import { auth, firestore } from "../../firebase/firebase";

export default function MessageList({
  roomId,
  isReadOnly,
  setIsReadOnly,
  setParticipants,
  participants,
}) {
  const roomRef = firestore.collection("rooms").doc(roomId);
  const messagesRef = roomRef.collection("messages");
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const observer = messagesRef
      .orderBy("timestamp")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setMessages((prev) => [...prev, change.doc.data()]);
          }
          // needed when we set up delete and edit functionality
          // if (change.type === 'modified') {
          //   console.log('Modified city: ', change.doc.data());
          // }
          // if (change.type === 'removed') {
          //   console.log('Removed city: ', change.doc.data());
          // }
        });
        return () => {
          // TODO: ensure this works after routing
          observer();
        };
      });
  }, []);

  useEffect(() => {
    const observer = firestore
      .collection("rooms")
      .doc(roomId)
      .onSnapshot(
        (docSnapshot) => {
          const { participants, readOnly, topic } = docSnapshot.data();
          setTopic(topic);
          if (readOnly) {
            setIsReadOnly(true);
          }
          setParticipants(participants);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );

    return () => {
      observer();
      // remove user from room when he enters other room
      // (async()=>{
      //   const newParticipants = updateActiveFlag(
      //     participants,
      //     auth.currentUser.uid
      //   );
      //   await roomRef.update({participants:newParticipants})
      // })()
    };
  }, []);

  const sendMessage = async (message) => {
    await messagesRef.add(message);
  };

  return (
    <div className="message-list">
      {/* <Toolbar
        title={topic}
        rightItems={[
          <ToolbarButton
            key="info"
            icon="ion-ios-information-circle-outline"
          />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />,
        ]}
      /> */}

      <div className="message-list-container">
        {messages.map((msg, i) => {
          let previous = messages[i - 1];
          let current = msg;
          let next = messages[i + 1];
          let isMine = current.author === auth.currentUser.uid;
          let currentMoment = moment(Date(current.timestamp));
          let prevBySameAuthor = false;
          let nextBySameAuthor = false;
          let startsSequence = true;
          let endsSequence = true;
          let showTimestamp = true;

          if (previous) {
            let previousMoment = moment(Date(previous.timestamp));
            let previousDuration = moment.duration(
              currentMoment.diff(previousMoment)
            );
            prevBySameAuthor = previous.author === current.author;

            if (prevBySameAuthor && previousDuration.as("hours") < 1) {
              startsSequence = false;
            }

            if (previousDuration.as("hours") < 1) {
              showTimestamp = false;
            }
          }

          if (next) {
            let nextMoment = moment(next.timestamp);
            let nextDuration = moment.duration(nextMoment.diff(currentMoment));
            nextBySameAuthor = next.author === current.author;

            if (nextBySameAuthor && nextDuration.as("hours") < 1) {
              endsSequence = false;
            }
          }
          console.log(current);
          return (
            <Message
              key={i}
              isMine={isMine}
              startsSequence={startsSequence}
              endsSequence={endsSequence}
              showTimestamp={showTimestamp}
              data={current}
            />
          );
        })}
      </div>
      {!isReadOnly && <Compose sendMessage={sendMessage} />}
    </div>
  );
}
