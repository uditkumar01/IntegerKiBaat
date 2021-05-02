import React, { useEffect } from "react";
import UserImgWithStatus from "../UserImgWithStatus";
import "./ConversationListItem.css";

export default function ConversationListItem({
    data: { user_img, name, active_status },
    sideBarOpen,
}) {
    return (
        <div className="conversation-list-item">
            <UserImgWithStatus
                photo={user_img}
                scale={sideBarOpen ? 1 : 0.87}
                userStatus={active_status?"active":"not-active"}
            />
            {sideBarOpen && (
                <div className="conversation-info">
                    <h1 className="conversation-title">{name}</h1>
                    <p className="conversation-snippet">{active_status?`is active now`:`is not active`}</p>
                </div>
            )}
        </div>
    );
}
