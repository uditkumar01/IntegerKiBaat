import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";

import "./MessageList.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function MessageList() {
  const messagesRef = firestore.collection("messages");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // (async () => {
    //   const snapshot = await messagesRef.orderBy("timestamp").get();
    //   if (snapshot.empty) {
    //     console.log("No matching documents.");
    //     return;
    //   }
    //   const fetchedMessages = [];
    //   snapshot.forEach((doc) => {
    //     fetchedMessages.push(doc.data());
    //   });
    //   setMessages(fetchedMessages);
    // })();
    const observer = messagesRef
      .orderBy("timestamp")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("New message", change.doc.data());
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
          observer();
        };
      });
  }, []);

  const sendMessage = async (message) => {
    await messagesRef.add(message);
    // setMessages((prev) => [...prev, { ...message, id }]);
  };

  return (
    <div className="message-list">
      <Toolbar
        title="Conversation Title"
        rightItems={[
          <ToolbarButton
            key="info"
            icon="ion-ios-information-circle-outline"
          />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />,
        ]}
      />

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
            let previousMoment = moment(previous.timestamp);
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

      <Compose
        // rightItems={[
        //     <ToolbarButton key="photo" icon="ion-ios-camera" />,
        //     <ToolbarButton key="image" icon="ion-ios-image" />,
        //     <ToolbarButton key="audio" icon="ion-ios-mic" />,
        //     <ToolbarButton key="money" icon="ion-ios-card" />,
        //     <ToolbarButton
        //         key="games"
        //         icon="ion-logo-game-controller-b"
        //     />,
        //     <ToolbarButton key="emoji" icon="ion-ios-happy" />,
        // ]}
        sendMessage={sendMessage}
      />
    </div>
  );
}
