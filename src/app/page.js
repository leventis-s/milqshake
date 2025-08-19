"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ComboBox from "./components/ComboBox";
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


const extractionOptions = ["Months", "Days of the Week", "Time Vocabulary", "Relative Time Vocabulary", "Other/Custom"];

const glossaryDefinitions = {
  "most frequent": "The term's most frequent translation in your corpus.",
  "frequency": "The number of times this term was translated to the most frequent translation.",
  "variants": "Other translations detected (e.g., plurals, spelling variations).",
};

const GlossaryTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow placement="top" />
))({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: 'white',
    color: '#000',
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    maxWidth: 250,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  [`& .MuiTooltip-arrow`]: {
    color: 'white',
  },
});

function FileDropzone({ label, file, setFile }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  const onClick = () => inputRef.current.click();
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      style={{
        border: dragOver ? "3px dashed #4da6ff" : "3px dashed #ccc",
        borderRadius: "8px",
        padding: "2rem",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "border-color 0.3s ease",
        backgroundColor: dragOver ? "#e3f2fd" : "#f9f9f9",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
        accept=".txt"
      />
      <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
        {label}
      </p>
      <p style={{ marginTop: "0.5rem", color: "#555", fontSize: "0.9rem" }}>
        {file ? file.name : "Drag & drop a file here, or click to select"}
      </p>
    </div>
  );
}

function DisclaimerModal({ onAccept }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          maxWidth: "500px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontWeight: "bold", fontSize: "1.5rem", color: "#4da6ff"}}>Disclaimer</h2>
        <p style={{ marginBottom: "1rem" }}>
           This tool is intended to support work within a language community, not replace it. By using this tool, you understand that the extracted data may contain errors. Please note that data is not fully protected and may be shared with external sources for processing.
        </p>
        <button
          onClick={onAccept}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4da6ff",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState("");
  const [selectedLang, setSelectedLang] = useState({
    language: "",
    code: "und",
  });
  const [extractionElement, setExtractionElement] = useState("");
  const [otherElement, setOtherElement] = useState("");
  const [englishFile, setEnglishFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csvUrl, setCsvUrl] = useState("");
  const [message, setMessage] = useState("");
  const [scriptType, setScriptType] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [csvData, setCsvData] = useState([]);


  const handleExtractionChange = (e) => {
    setExtractionElement(e.target.value);
    if (e.target.value !== "Other") {
      setOtherElement("");
    }
  };

  useEffect(() => {
    const accepted = sessionStorage.getItem("disclaimerAccepted");
    if (!accepted) {
      setShowDisclaimer(true);
    }
  }, []);
  
  const handleAcceptDisclaimer = () => {
    sessionStorage.setItem("disclaimerAccepted", "true");
    setShowDisclaimer(false);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language) return setMessage("Please enter a language.");
    if (!extractionElement)
      return setMessage("Please select an extraction element.");
    if (extractionElement === "Other/Custom" && !otherElement.trim())
      return setMessage("Please specify the extraction element.");
    if (!englishFile || !targetFile)
      return setMessage("Please upload both files.");

    setMessage("");
    setLoading(true);
    setCsvUrl("");

    const formData = new FormData();
    formData.append("extractionElement", extractionElement); 
    formData.append("customRegex", otherElement || ""); 

    formData.append("language", language);
    formData.append("scriptType", scriptType);
    formData.append("englishFile", englishFile);
    formData.append("targetFile", targetFile);

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error processing files");

      const blob = await res.blob();
      const text = await blob.text();
      const rows = text.split("\n").map((row) =>
        row.split(",").map((cell) => cell.replace(/^"|"$/g, "")) // remove starting/ending quotes
      );

      setCsvData(rows);

      const url = URL.createObjectURL(blob);
      setCsvUrl(url);
      setMessage("File processed successfully! Download below.");
    } catch (err) {
      setMessage(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fffde7",
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily: "Arial Black, Arial, sans-serif",
        color: "#222",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}

      <main
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#fffde7",
          padding: "2rem",
          borderRadius: "8px",
          opacity: showDisclaimer ? 0.3 : 1,
          pointerEvents: showDisclaimer ? "none" : "auto",
        }}
      >
        {/* Header with text + logo */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start", // align items a bit up
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "1.7rem",
              marginTop: "-.5rem",
              color: "#4da6ff",
            }}
          >
            MILQSHAKE
          </h1>
          <Image
            src="/milqshake_transparent.png"
            alt="Milqshake logo"
            width={80}
            height={80}
            style={{ marginTop: "-1.3rem" }} // lift the logo slightly
          />
        </div>
        {loading && (
          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              marginTop: "-.5rem",
              backgroundColor: "#fff3cd",
              color: "#856404",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Processing your files… This may take a few minutes. Please be patient and avoid closing or refreshing the page.
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* ComboBox TESTING GROUNDS */}
          <ComboBox
            onChange={(val) => {
              setSelectedLang(val);
              setLanguage(val.language); // keep the string in sync for handleSubmit
            }}
          />

          {/* Extraction Elements dropdown */}
          <label style={{ fontWeight: "bold" }}>
            Target Terms:
            <select
              value={extractionElement}
              onChange={handleExtractionChange}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                fontFamily: "Arial",
                backgroundColor: "white",
                color: extractionElement === "" ? "gray" : "black",
              }}
            >
              <option value="" disabled>
                Select an element
              </option>
              {extractionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          {/* Other input appears if "Other" selected */}
          {extractionElement === "Other/Custom" && (
            <label style={{ fontWeight: "bold" }}>
              Insert Custom Regex:
              <input
                type="text"
                value={otherElement}
                onChange={(e) => setOtherElement(e.target.value)}
                placeholder="Type your extraction regex"
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                  fontFamily: "Arial",
                  backgroundColor: "white",
                }}
              />
            </label>
          )}

          {/* Script type selector */}
          <label style={{ fontWeight: "bold" }}>
            Script Type:
            <select
              value={scriptType}
              onChange={(e) => setScriptType(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                fontFamily: "Arial",
                backgroundColor: "white",
                color: scriptType === "" ? "gray" : "black",
              }}
            >
              <option value="" disabled>
                Select an element
              </option>
              <option value="Latin">Latin</option>
              <option value="Devanagari">Devanagari</option>
              <option value="Arabic">Arabic</option>
              <option value="Bengali">Bengali</option>
              <option value="Chinese">Chinese</option>
              <option value="Cyrillic">Cyrillic</option>
              <option value="Other-script">Other</option>
            </select>
          </label>

          {/* File upload boxes side by side */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "250px", marginTop: ".75rem" }}>
              <FileDropzone
                label="English language file"
                file={englishFile}
                setFile={setEnglishFile}
              />
            </div>
            <div style={{ flex: 1, minWidth: "250px", marginTop: ".75rem" }}>
              <FileDropzone
                label="Target language file"
                file={targetFile}
                setFile={setTargetFile}
              />
            </div>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem",
              fontWeight: "bold",
              backgroundColor: "#4da6ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "1rem",
            }}
          >
            {loading ? "Processing..." : "Upload & Parse"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              color: message.toLowerCase().includes("error") ? "red" : "blue",
            }}
          >
            {message}
          </p>
        )}


        {csvData.length > 0 && (
          <div style={{ position: "relative", width: '100%', marginBottom: "1rem", marginTop: "3rem" }}>
            {/* Download button */}
            {csvUrl && (
              <a
                href={csvUrl}
                download="result.csv"
                style={{
                  position: "absolute",
                  bottom: "0.5rem",
                  left: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ffb6c1",
                  color: "black",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  zIndex: 10,
                  transition: "transform 0.2s, background-color 0.2s",
              }}
                onClick={() => {
                  setTimeout(() => URL.revokeObjectURL(csvUrl), 100);
                  setCsvUrl("");
                }}
              >
                Download CSV
              </a>
            )}

            <DataGrid
              rows={csvData.slice(1).map((row, index) => ({
                id: index,
                ...row.reduce((acc, val, i) => {
                  acc[`col${i}`] = val;
                  return acc;
                }, {})
              }))}
              columns={csvData[0].map((header, i) => {
                const key = header.trim().toLowerCase();
                const hasDefinition = glossaryDefinitions[key];
              
                return {
                  field: `col${i}`,
                  headerName: header || `Col ${i + 1}`,
                  flex: 1,
                  renderHeader: (params) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      {header}
                      {hasDefinition && (
                        <GlossaryTooltip title={glossaryDefinitions[key]}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "16px",
                              height: "16px",
                              lineHeight: "16px",
                              textAlign: "center",
                              borderRadius: "50%",
                              backgroundColor: "#4da6ff",
                              color: "white",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            i
                          </span>
                        </GlossaryTooltip>
                      )}
                    </div>
                  ),
                };
              })}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        )}

      </main>
    </div>
  );
}
