import React from "react";
import "./Compose.css";

export default function Compose({ rightItems }) {
    return (
        <div className="compose">
            <input
                type="text"
                className="compose-input"
                placeholder="Type a message, @name"
            />

            {rightItems}
        </div>
    );
}
