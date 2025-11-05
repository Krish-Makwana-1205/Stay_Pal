import React, { useEffect, useRef, useState } from "react";
import "../StyleSheets/Alert.css";

export default function Alert({ message, type = "info", onClose, autoClose = 5000 }) {
  if (!message) return null;

  const timeoutRef = useRef(null);
  const endRef = useRef(null);
  const remainingRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoClose || typeof autoClose !== "number") return;

    const now = Date.now();
    endRef.current = now + autoClose;
    remainingRef.current = autoClose;

    timeoutRef.current = setTimeout(() => {
      onClose?.();
    }, autoClose);

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onClose, autoClose]);

  const handleMouseEnter = () => {
    if (!autoClose || typeof autoClose !== "number") return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const now = Date.now();
    remainingRef.current = Math.max(0, (endRef.current || now) - now);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!autoClose || typeof autoClose !== "number") return;
    if (!remainingRef.current || remainingRef.current <= 0) {
      onClose?.();
      return;
    }
    endRef.current = Date.now() + remainingRef.current;
    timeoutRef.current = setTimeout(() => onClose?.(), remainingRef.current);
    setIsPaused(false);
  };

  const title =
    type === "success" ? "Success" : type === "error" ? "Error" : "Notice";

  const progressDuration =
    autoClose && typeof autoClose === "number" ? `${autoClose}ms` : "0ms";

  return (
    <div
      className={`alert-toast alert-${type} ${isPaused ? "paused" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ["--progress-duration"]: progressDuration }}
    >
      <div className="alert-content">
        <div className="alert-header">
          <strong>{title}</strong>
          <button
            className="alert-close-btn"
            onClick={() => onClose?.()}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="alert-body">
          <p>{message}</p>
        </div>
        <div className="alert-progress" aria-hidden="true" />
      </div>
    </div>
  );
}
