import React from "react";
import "./FormField.css";

export default function FormField({ label }) {
    return (
        <div class="form-field">
            <input placeholder=" " type="text" className={`input-text`} />
            <label className={`input-label`}>{label}</label>
        </div>
    );
}
