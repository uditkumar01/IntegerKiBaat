
import "./UserInfoBar.css";
import UserImgWithStatus from "../UserImgWithStatus";
import Collapsible from "../Collapsible";
export default function UserInfoBar({userBarOpen, setUserBarOpen}) {
    
    return (
        <div className={`user-info-bar ${!userBarOpen?"close":""}`}>
            <div className="user-info-card">
                <UserImgWithStatus
                    photo={`http://www.pngmart.com/files/3/Man-PNG-Pic.png`}
                    userStatus={"active"}
                    scale={1}
                    height={130}
                    width={130}
                />
                <h2 className={`user-name`}>bala blala</h2>
                <p className={`user-role`}>CEO of Nothing</p>
            </div>
            <Collapsible title={`HELLO WORLD`}/>
        </div>
    );
}
