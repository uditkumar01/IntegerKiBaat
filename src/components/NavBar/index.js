import { auth } from "../../firebase/firebase";
import "./NavBar.css";

export default function NavBar({}) {
    return (
        <nav className="nav-container">
            <div className="nav-left">
                <span className="nav-brand">
                    <em>
                        <i className="ion-ios-bolt"></i>
                    </em>
                    <strong>Chat</strong>
                </span>
            </div>
            <div className="nav-right">
                <a className={`ion-social-twitter`}></a>
                <a className={`ion-social-instagram-outline`}></a>
                <a className={`ion-social-octocat`}></a>
                <a className={`fas fa-sign-out-alt`} onClick={()=>{
                    auth.signOut();
                }}></a>
            </div>
        </nav>
    );
}
