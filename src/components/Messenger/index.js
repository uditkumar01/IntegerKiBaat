import React, { useState } from "react";
import MessageList from "../MessageList";
import SideBar from "../SideBar";
import SideBarSm from "../SideBarSm";
import UserInfoBar from "../UserInfoBar";
import "./Messenger.css";

export default function Messenger({}) {
    const [sideBarOpen, setSideBarOpen] = useState(true);
    const [userBarOpen, setUserBarOpen] = useState(false);
    return (
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
                    />
                ) : (
                    <SideBarSm
                        sideBarOpen={sideBarOpen}
                        setSideBarOpen={setSideBarOpen}
                        setUserBarOpen={setUserBarOpen}
                    />
                )}
            </div>

            <div className="scrollable content">
                <MessageList />
            </div>

            <div className="scrollable sidebar">
                <UserInfoBar
                    userBarOpen={userBarOpen}
                    setUserBarOpen={setUserBarOpen}
                />
            </div>
        </div>
    );
}
