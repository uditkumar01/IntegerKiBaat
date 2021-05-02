import "./BlockButton.css";
export default function BlockButton({
    name,
    icon,
    isBlock,
    buttonClass,
    onClick,
}) {
    return (
        <button
            className={`btn ${isBlock ? "btn-block" : ""} ${
                buttonClass ? buttonClass : ""
            }`}
            onClick={onClick}
        >
            {icon && <i className={icon}></i>}
            {name}
        </button>
    );
}
