import { createPortal } from "react-dom";
import "../styles/Modal.css";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">
          x
        </button>
        <h2>Are you sure?</h2>
        <p>{message}</p>
        <div className="modal-options">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") // Ensure this element exists in your HTML
  );
};

export default Modal;
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
