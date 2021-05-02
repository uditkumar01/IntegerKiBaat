import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import "./Compose.css";

export default function Compose({ sendMessage }) {
  const [message, setMessage] = useState("");

  const addMessageClick = () => {
    sendMessage({
      author: auth.currentUser.uid,
      message,
      timestamp: new Date(),
    });
    setMessage("");
  };
  const addMessageToChat = (e) => {
    if (e.key === "Enter") {
      addMessageClick();
    }
  };

  return (
    <div className="compose">
      <button className="btn-compose emoji-btn far fa-grin"></button>
      <input
        type="text"
        value={message}
        className="compose-input"
        placeholder="Type a message, @name"
        onKeyDown={(e) => addMessageToChat(e)}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="btn-compose send-btn" onClick={addMessageClick}>
        Send
      </button>
      <button className="btn-compose send-btn mini-send-btn">
        <i className={`ion-android-send`}></i>
      </button>
    </div>
  );
}
