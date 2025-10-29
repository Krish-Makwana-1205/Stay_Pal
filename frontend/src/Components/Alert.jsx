// ...existing code...
import React, { useEffect } from "react";
import "../StyleSheets/Alert.css";

export default function Alert({ message, type = "info", onClose, autoClose = 5000 }) {
  // don't render anything when there's no message
  if (!message) return null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    let t;
    if (autoClose && typeof autoClose === "number") {
      t = setTimeout(() => onClose?.(), autoClose);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      if (t) clearTimeout(t);
    };
  }, [onClose, autoClose]);

  const title = type === "success" ? "Success" : type === "error" ? "Error" : "Notice";

  return (
    <div className="alert-overlay" onClick={() => onClose?.()}>
      <div className={`alert-modal alert-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-header">
          <strong>{title}</strong>
          <button className="alert-close-btn" onClick={() => onClose?.()} aria-label="Close">
            ×
          </button>
        </div>
        <div className="alert-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
// ...existing code...