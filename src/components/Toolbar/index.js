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
                    <BlockButton
                        name={"new room"}
                        icon={`ion-android-add`}
                        isBlock={true}
                    />
                    <BlockButton
                        name={"join room"}
                        icon={`ion-log-in`}
                        isBlock={true}
                    />
                    <BlockButton
                        name={"more info"}
                        icon={`ion-ios-photos-outline`}
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
                    <ToolbarButton icon={`ion-android-add`} />
                    <ToolbarButton icon={`ion-log-in`} />
                    <ToolbarButton icon={`ion-ios-search-strong`} />
                    <ToolbarButton
                        icon={`ion-ios-photos-outline`}
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
