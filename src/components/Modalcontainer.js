// ModalContainer.js
import React, { useContext, useState } from "react";
import "./modalcontainer.css";
import GlobalContext from "../context/GlobalContext";
 
const ModalContainer = ({ children, onClose }) => {
  const { setShowEventModal } = useContext(GlobalContext);
  const [isCloseButtonClicked, setIsCloseButtonClicked] = useState(false);
 
  const handleCloseModal = () => {
    setShowEventModal(false);
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