import React from "react";
import moment from "moment";
import "./Message.css";
import UserImgWithStatus from "../UserImgWithStatus";

export default function Message({
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
}) {
    // console.log(data.author.name);
    const friendlyTimestamp = moment(Date(data.timestamp)).format("ddd LL");
    // console.log();
    return (
        <div
            className={[
                "message",
                `${isMine ? "mine" : ""}`,
                `${startsSequence ? "start" : ""}`,
                `${endsSequence ? "end" : ""}`,
            ].join(" ")}
        >
            {showTimestamp && (
                <div className="timestamp">{friendlyTimestamp}</div>
            )}

            <div className="bubble-container">
                <span
                    className={`bubble-user-img ${
                        endsSequence ? "" : "make-invisible"
                    }`}
                    title="Rohan"
                >
                    {!isMine && (
                        <UserImgWithStatus
                            photo={data.author.user_img}
                            userStatus={"active"}
                            imageClass={`message-round-img`}
                            scale={0.85}
                        />
                    )}
                </span>
                <div className="bubble" title={friendlyTimestamp}>
                    {!isMine && (
                        <p className={`message-author`}>{data.author.name}</p>
                    )}
                    <span>{data.message}</span>
                    <small
                        className={`message-time ${
                            endsSequence ? "" : "make-invisible"
                        }`}
                    >
                        8 min ago
                        {/* <b className={`double-check ${seen ? "seen" : "sent"}`}>
              <span className={`ion-ios-checkmark-empty`}></span>
              <span className={`ion-ios-checkmark-empty`}></span>
            </b> */}
                    </small>
                </div>
            </div>
        </div>
    );
}
