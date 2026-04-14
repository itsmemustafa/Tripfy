import React, { useCallback, useEffect, useState } from "react";
import "./Toast.css";

const Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [id, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div className={`toast toast--${type} ${isExiting ? "exiting" : ""}`}>
      <div className="toast__content">
        {title && <h4 className="toast__title">{title}</h4>}
        <p className="toast__message">{message}</p>
      </div>
      <button className="toast__close" onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default Toast;
