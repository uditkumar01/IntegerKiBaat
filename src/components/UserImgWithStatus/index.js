import "./UserImgWithStatus.css";
export default function UserImgWithStatus({
    userStatus,
    photo,
    scale,
    height,
    width,
    imageClass
}) {
    return (
        <>
            <span
                className={`user-status ${userStatus} ${imageClass}`}
                style={{ transform: `scale(${scale})` }}
                style={height&&width?{height,width}:{}}
            >
                <img
                    className={`conversation-photo`}
                    src={photo}
                    alt="user img"
                    style={height&&width?{height:height-2,width:width-2}:{}}
                />
            </span>
        </>
    );
}
