import React from "react";
import moment from "moment";
import "./Message.css";
import UserImgWithStatus from "../UserImgWithStatus";
import Linkify from "linkify-react";

export default function Message({
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
}) {
    // console.log(data.author.name);
    const friendlyTimestamp = moment(Date(data.timestamp)).fromNow(
        updateLocale("en", {
          relativeTime: {
            future: "in %s",
            past: "%s ",
            s: "sec",
            m: "%d m",
            mm: "%d m",
            h: "%d h",
            hh: "%d h",
            d: "%d d",
            dd: "%d d",
            M: "a mth",
            MM: "%d mths",
            y: "y",
            yy: "%d y"
          }
        })
      );
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
                    <Linkify as="p" options={{}}>
                        {data?.message || ''}
                      </Linkify>
                    <small
                        className={`message-time ${
                            endsSequence ? "" : "make-invisible"
                        }`}
                    >
                        {friendlyTimestamp}
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
