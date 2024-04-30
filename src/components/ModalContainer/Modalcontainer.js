// ModalContainer.js
import React, { useState } from "react";
import "./ModalContainer.css";
 
const ModalContainer = ({ children, onClose }) => {
  const [isCloseButtonClicked, setIsCloseButtonClicked] = useState(false);
 
  const handleCloseModal = () => {
    setIsCloseButtonClicked(true);
 
    if (onClose) {
      onClose();
    }
  };
 
  return (
    <div className={`modal-container ${isCloseButtonClicked ? "closed" : ""}`}>
      <button className="close" onClick={handleCloseModal}>
        &#10006;
      </button>
      {children}
    </div>
  );
};
 
export default ModalContainer;