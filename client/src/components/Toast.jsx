import { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/Toast.css";
import PropTypes from "prop-types";

const Toast = ({ message, isVisible, isError, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className={`toast ${isError ? "toast-error" : "toast-success"}`}>
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>,
    document.getElementById("toast-root")
  );
};

export default Toast;
Toast.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
