import React from "react";
import "./FormField.css";

export default function FormField({ label, onChange, value, fieldClass }) {
    return (
        <div class={`form-field ${fieldClass?fieldClass:""}`}>
            <input
                placeholder=" "
                type="text"
                className={`input-text`}
                onChange={onChange}
                value={value}
            />
            <label className={`input-label`}>{label}</label>
        </div>
    );
}
