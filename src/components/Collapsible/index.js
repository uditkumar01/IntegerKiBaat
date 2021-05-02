import { useState } from "react";
import "./Collapsible.css";
export default function Collapsible({ title, contentList }) {
    const [collapsibleOpen, setCollapsibleOpen] = useState(false);
    return (
        <div className={`collapsible`}>
            <p
                className={`collapsible-heading ${
                    collapsibleOpen ? "collapsible-open" : ""
                }`}
                onClick={() =>
                    setCollapsibleOpen((collapsibleOpen) => !collapsibleOpen)
                }
            >
                <span>{title}</span>
                <i className={collapsibleOpen?"ion-chevron-up":"ion-chevron-down"}></i>
            </p>
            <ul
                className={
                    collapsibleOpen
                        ? `collapsible-items close`
                        : `collapsible-items`
                }
            >
                {contentList ? (
                    contentList.map((item) => {
                        return (
                            <li className={`collapsible-item`}>
                                <i class="ion-ios-paper-outline collapsible-icon"></i>
                                <p className="collapsible-title">
                                    <span>name of channel</span>
                                    <small>10d ago</small>
                                </p>
                            </li>
                        );
                    })
                ) : (
                    <li className={`collapsible-item no-history`}>
                        <i class="ion-social-dropbox no-history-icon"></i>
                        <center>
                            <p className="collapsible-title">
                                <span>No History</span>
                            </p>
                        </center>
                    </li>
                )}
            </ul>
        </div>
    );
}
