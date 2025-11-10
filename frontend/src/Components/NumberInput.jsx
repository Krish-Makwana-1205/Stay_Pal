import React from "react";

export default function NumberInput({ name, value, onChange, required = false, min = 0, placeholder }) {
  const handleKeyDown = (e) => {
    // Block e, E, +, -, .
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInput = (e) => {
    // Strip non-digit characters (for paste)
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "" || Number(val) >= 0) {
      onChange(e); // delegate to parent
    }
  };

  return (
    <input
      type="number"
      name={name}
      value={value}
      min={min}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onChange={handleChange}
      required={required}
    />
  );
}
