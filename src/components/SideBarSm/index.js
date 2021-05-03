import React, { useState, useEffect, useRef } from "react";
import ConversationListItem from "../ConversationListItem";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import axios from "axios";

import "./SideBarSm.css";

export default function SideBarSm({
    sideBarOpen,
    setSideBarOpen,
    setUserBarOpen,
    participants,
    ...rest
}) {
    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        getConversations();
    }, []);

    const getConversations = () => {
        axios.get("https://randomuser.me/api/?results=20").then((response) => {
            let newConversations = response.data.results.map((result) => {
                return {
                    photo: result.picture.large,
                    name: `${result.name.first} ${result.name.last}`,
                    text:
                        "Hello world! This is a long message that needs to be truncated.",
                };
            });
            setConversations([...conversations, ...newConversations]);
        });
    };
    return (
        <div className="sidebar sidebar-sm">
            <Toolbar
                title={
                    <>
                        <em>
                            <i className="fas fa-bolt"></i>
                        </em>
                        <strong>Chat</strong>
                    </>
                }
                sideBarOpen={sideBarOpen}
                setUserBarOpen={setUserBarOpen}
                {...rest}
                rightItems={[
                    <ToolbarButton
                        key="add"
                        icon="fas fa-bars"
                        onClick={() =>
                            setSideBarOpen((sideBarOpen) => !sideBarOpen)
                        }
                    />,
                ]}
            />
            <div className={`user-container`}>
                {participants.map((conversation) => (
                    <ConversationListItem
                        key={conversation.name}
                        sideBarOpen={sideBarOpen}
                        data={conversation}
                        userStatus={
                            ["not-active", "active", "standby"][
                                Math.floor(Math.random() * 3)
                            ]
                        }
                    />
                ))}
            </div>
        </div>
    );
}
