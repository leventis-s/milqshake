import { useState, useEffect } from "react";

export default function FirstVisitModal({ agreed, setAgreed }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = checkbox screen, 2 = X-close screen

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      setIsOpen(true);
      localStorage.setItem("hasSeenModal", "true"); // Mark as seen
    }
  }, []);

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      localStorage.setItem("userAgreed", "true");
      setAgreed(true);
      setStep(2); // immediately jump to step 2
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 20 }}>DISCLAIMER</h2>
            <p
              style={{
                fontSize: 15,
                color: "#454545",
                textAlign: "left",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              The outputs of MILQSHAKE are not 100% accurate. They are based on
              probabilistic inferences, which extract the most likely pairings
              of target terms from the corpora. For more information, please see
              the info page.
            </p>
            <label style={{ fontSize: 15 }}>
              <input type="checkbox" onChange={handleCheckboxChange} /> I have
              read and understand this disclaimer.
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <button
              onClick={handleClose}
              style={styles.xButton}
              aria-label="Close"
            >
              ✖️
            </button>
            <h2>Thank you!</h2>
            <p>You may now continue to the site.</p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    position: "relative",
  },
  xButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
};
