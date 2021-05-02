import { useEffect, useState } from "react";
import { firestore, auth } from "../../firebase/firebase";
import "./Collapsible.css";
export default function Collapsible({ title }) {
    const [collapsibleOpen, setCollapsibleOpen] = useState(false);
    const [prevRooms, setPrevRooms] = useState([]);
    useEffect(() => {
        (async () => {
            const snapshot = await firestore
                .collection("rooms")
                .where("participants", "array-contains", {
                    active: false,
                    userId: auth.currentUser.uid,
                })
                .get();
            if (snapshot.empty) {
                console.log("No matching documents.");
            }
            let newRooms = [];
            snapshot.forEach((doc) => {
                // console.log(doc.id, "=>", doc.data());
                const { name, readOnly } = doc.data();
                newRooms.push({ _id: doc.id, name, readOnly });
            });
            setPrevRooms(newRooms);
        })();
    }, []);
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
                <i
                    className={
                        collapsibleOpen ? "ion-chevron-up" : "ion-chevron-down"
                    }
                ></i>
            </p>
            <ul
                className={
                    collapsibleOpen
                        ? `collapsible-items close`
                        : `collapsible-items`
                }
            >
                {prevRooms ? (
                    prevRooms.map(({ _id, name, readOnly }) => {
                        return (
                            <li key={_id} className={`collapsible-item`} onClick={()=>{
                                navigator.clipboard.writeText(_id);
                            }}>
                                <i class="ion-ios-copy-outline collapsible-icon"></i>
                                <p className={`collapsible-title ${readOnly?"danger":""}`}>
                                    <span>{name}</span>
                                    <small>
                                        {readOnly ? (
                                            <>
                                                <i className="ion-ios-circle-filled"></i>
                                                freezed
                                            </>
                                        ) : (
                                            <>
                                                <i className="ion-ios-circle-filled"></i>
                                                live
                                            </>
                                        )}
                                    </small>
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
