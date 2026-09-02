"use client";

import { useState } from "react";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        <span className="input-icon">🔒</span>
        <input
          type={visible ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
