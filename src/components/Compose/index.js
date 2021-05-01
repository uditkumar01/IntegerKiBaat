import React, { useState } from "react";
import { auth } from "../../firebase";
import "./Compose.css";

export default function Compose({ rightItems, sendMessage }) {
  const [message, setMessage] = useState("");
  const addMessageToChat = (e) => {
    if (e.key === "Enter") {
      sendMessage({
        author: auth.currentUser.uid,
        message,
        timestamp: new Date(),
      });
      setMessage("");
    }
  };
  return (
    <div className="compose">
      <input
        type="text"
        className="compose-input"
        placeholder="Type a message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => addMessageToChat(e)}
      />

      {rightItems}
    </div>
  );
}
