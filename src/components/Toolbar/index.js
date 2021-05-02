import React from "react";
import BlockButton from "../BlockButton";
import "./Toolbar.css";
import FormField from "../FormField";
import ToolbarButton from "../ToolbarButton";

export default function Toolbar({
    title,
    rightItems,
    sideBarOpen,
    setUserBarOpen,
    closeRoom,
    leaveRoom,
    isAdmin,
    isLoading,
}) {
    return (
        <div className="toolbar">
            {/* <div className="left-items">{ leftItems }</div> */}
            <div className={`upper-toolbar`}>
                {sideBarOpen && <h1 className="toolbar-title">{title}</h1>}

                <div className="right-items">{rightItems}</div>
            </div>
            {sideBarOpen ? (
                <>
                    {isAdmin && (
                        <BlockButton
                            name={"freeze chat"}
                            icon={`${
                                isLoading
                                    ? "ion-load-c animate-icon"
                                    : "fas fa-wind"
                            }`}
                            isBlock={true}
                            onClick={closeRoom}
                            disable={isLoading}
                        />
                    )}
                    <BlockButton
                        name={"leave room"}
                        icon={`${
                            isLoading
                                ? "ion-load-c animate-icon"
                                : "fas fa-sign-out-alt"
                        }`}
                        buttonClass={`danger`}
                        isBlock={true}
                        onClick={leaveRoom}
                        disable={isLoading}
                    />

                    <BlockButton
                        name={" more info "}
                        icon={`fas fa-ellipsis-h`}
                        buttonClass={"temp-btn"}
                        isBlock={true}
                        onClick={() =>
                            setUserBarOpen((userBarOpen) => !userBarOpen)
                        }
                    />
                    <FormField label="Search Rooms" />
                </>
            ) : (
                <div className="btn-container">
                    <ToolbarButton
                        icon={`${
                            isLoading
                                ? "ion-load-c animate-icon"
                                : "fas fa-wind"
                        }`}
                        onClick={closeRoom}
                        disable={isLoading}
                    />
                    <ToolbarButton
                        icon={`${
                            isLoading
                                ? "ion-load-c animate-icon"
                                : "fas fa-sign-out-alt"
                        }`}
                        buttonClass={`danger`}
                        onClick={leaveRoom}
                        disable={isLoading}
                    />
                    <ToolbarButton icon={`fas fa-search`} />
                    <ToolbarButton
                        icon={`fas fa-ellipsis-h`}
                        buttonClass={"temp-btn"}
                        onClick={() =>
                            setUserBarOpen((userBarOpen) => !userBarOpen)
                        }
                    />
                </div>
            )}
            <span className="blur-effect"></span>
        </div>
    );
}
