
import "./UserInfoBar.css";
import UserImgWithStatus from "../UserImgWithStatus";
import Collapsible from "../Collapsible";
import { auth } from "../../firebase/firebase";
export default function UserInfoBar({userBarOpen, setUserBarOpen, roomId}) {
    
    return (
        <div className={`user-info-bar ${userBarOpen?"open":""}`}>
            <div className="user-info-card">
                <UserImgWithStatus
                    photo={auth.currentUser.photoURL}
                    userStatus={"active"}
                    scale={1}
                    height={130}
                    width={130}
                />
                <h2 className={`user-name`}>{auth.currentUser.displayName}</h2>
                <p className={`user-role`}>{auth.currentUser.email}</p>
            </div>
            <Collapsible title={`Copy Session Id`} onlyName={true} roomId={roomId}/>
            <Collapsible title={`Previous Sessions`} roomId={roomId}/>
        </div>
    );
}
