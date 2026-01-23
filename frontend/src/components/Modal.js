import { useTranslation } from "react-i18next";

const Modal = ({ children, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {children}
        {onClose && (<button className="btn btn-secondary btn-narrow" onClick={onClose}>
          {t("close")}
        </button>)}
      </div>
    </div>
  );
};

// Inline styles for the modal
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  width: "50%"
};

export default Modal;