import React from 'react';
import './ToolbarButton.css';

export default function ToolbarButton({icon, buttonClass, onClick, disabled}) {
    return (
      <button className={`toolbar-button ${icon} ${buttonClass}`} onClick={onClick} disabled={disabled}></button>
    );
}