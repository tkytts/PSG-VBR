import { useTranslation } from "react-i18next";

const InputModal = ({ onUnderstood, inputRef, text }) => {
    const inputPosition = inputRef.getBoundingClientRect();
    const { t } = useTranslation();

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        pointerEvents: 'none',
    };

    const customStyle = {
        position: 'absolute',
        top: inputPosition.top,
        left: inputPosition.left,
        width: inputPosition.width,
        height: inputPosition.height,
        padding: '10px',
        border: '2px solid blue',
        borderRadius: '5px',
        backgroundColor: 'transparent',
        zIndex: 1001,
        pointerEvents: 'auto',
    };

    const textBoxStyle = {
        position: 'absolute',
        top: inputPosition.top + inputPosition.height + 10, // Adjust as needed
        left: inputPosition.left,
        padding: '10px',
        backgroundColor: '#fff', // Keep opaque
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: 1002,
        textAlign: 'center',
    };

    const arrowStyle = {
        position: 'absolute',
        top: inputPosition.top + inputPosition.height, // Adjust as needed
        left: inputPosition.left + 20, // Adjust as needed
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '10px solid #fff', // Keep opaque
        zIndex: 1002,
        transform: 'rotate(180deg)', // Rotate the arrow 180 degrees
    };

    const buttonWrapperStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    };

    return (
        <div>
            <div style={overlayStyle}></div>
            <div style={customStyle}></div>
            <div style={textBoxStyle}>
                <p>{text}</p>
                <div style={buttonWrapperStyle}>
                    <button
                        className="btn btn-primary"
                        style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
                        onClick={onUnderstood}
                    >
                        {t("understood")}
                    </button>
                </div>
            </div>
            <div style={arrowStyle}></div>
        </div>
    );
};

export default InputModal;