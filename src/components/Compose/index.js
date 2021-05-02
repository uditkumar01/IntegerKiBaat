import React from "react";
import "./Compose.css";

export default function Compose({ rightItems }) {
    return (
        <div className="compose">
            <button className="btn-compose emoji-btn far fa-grin"></button>
            <input
                type="text"
                className="compose-input"
                placeholder="Type a message, @name"
            />

            <button className="btn-compose send-btn">send</button>
            <button className="btn-compose send-btn mini-send-btn"><i className={`ion-android-send`}></i></button>
        </div>
    );
}
