import React, { useEffect } from "react";
import UserImgWithStatus from "../UserImgWithStatus";
import "./ConversationListItem.css";

export default function ConversationListItem({
    data: { photo, name, text },
    userStatus,
    sideBarOpen,
}) {
    return (
        <div className="conversation-list-item">
            <UserImgWithStatus
                photo={photo}
                scale={sideBarOpen ? 1 : 0.87}
                useStatus={userStatus}
            />
            {sideBarOpen && (
                <div className="conversation-info">
                    <h1 className="conversation-title">{name}</h1>
                    <p className="conversation-snippet">{text}</p>
                </div>
            )}
        </div>
    );
}
