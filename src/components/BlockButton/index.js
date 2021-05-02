import "./BlockButton.css";
export default function BlockButton({
    name,
    icon,
    isBlock,
    buttonClass,
    onClick,
    disabled
}) {
    return (
        <button
            className={`btn ${isBlock ? "btn-block" : ""} ${
                buttonClass ? buttonClass : ""
            }`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <i className={icon}></i>}
            {name}
        </button>
    );
}
