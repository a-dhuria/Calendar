// ModalContainer.js
import React, { useContext } from "react";
import "./modalcontainer.css";
import GlobalContext from "../context/GlobalContext";

const ModalContainer = ({ children, onClose }) => {
  const { setShowEventModal } = useContext(GlobalContext);

  const handleCloseModal = () => {
    console.log("Close button clicked"); // Add this line for debugging
    setShowEventModal(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-container">
      <button className="close" onClick={handleCloseModal}>
        
      </button>
      {children}
    </div>
  );
};

export default ModalContainer;
