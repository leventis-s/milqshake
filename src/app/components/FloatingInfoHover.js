import { useState } from "react"

function FloatingInfoHover() {
    const [hover, setHover] = useState(false);
  
    return (
      <div
        style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1100 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Only show the circle when NOT hovering */}
        {!hover && (
          <div
            style={{
              backgroundColor: "white",
              border: "2px solid #4da6ff",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <span style={{ color: "#4da6ff", fontWeight: "bold", fontSize: "1.5rem" }}>i</span>
          </div>
        )}
  
        {/* Popup on hover */}
        {hover && (
          <div
            style={{
              width: "270px",
              backgroundColor: "white",
              border: "2px solid #4da6ff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              padding: "1rem",
              fontSize: ".9rem",
              color: "#222",
            }}
          >
            Confused? Visit our{" "}
            <a
              href="/info"
              style={{ color: "#4da6ff", textDecoration: "underline", fontWeight: "bold" }}
            >
              instructions page
            </a>{" "}
            for guidance on how to use the tool.
          </div>
        )}
      </div>
    );
  }

export default FloatingInfoHover;