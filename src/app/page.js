"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import ComboBox from "./components/ComboBox";

const extractionOptions = ["Months", "Days of the Week", "Time Vocabulary", "Relative Time Vocabulary", "Other/Custom"];

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
          By using this tool, you understand that the extracted data may contain errors. It is intended to support work within a language community, not replace it. Please note that data is not fully protected and may be shared with ChatGPT for processing.
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
  const [showDisclaimer, setShowDisclaimer] = useState(true)

  const handleExtractionChange = (e) => {
    setExtractionElement(e.target.value);
    if (e.target.value !== "Other") {
      setOtherElement("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language) return setMessage("Please enter a language.");
    if (!extractionElement)
      return setMessage("Please select an extraction element.");
    if (extractionElement === "Other" && !otherElement.trim())
      return setMessage("Please specify the extraction element.");
    if (!englishFile || !targetFile)
      return setMessage("Please upload both files.");

    setMessage("");
    setLoading(true);
    setCsvUrl("");

    const formData = new FormData();
    formData.append(
      "extractionElement",
      extractionElement === "Other" ? otherElement : extractionElement
    );
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
      {showDisclaimer && <DisclaimerModal onAccept={() => setShowDisclaimer(false)} />}

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
            style={{ marginTop: "-.8rem" }} // lift the logo slightly
          />
        </div>
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
          {extractionElement === "Other" && (
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

        {/* CSV Download link */}
        {csvUrl && (
          <a
            href={csvUrl}
            download="result.csv"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#4da6ff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
            onClick={() => {
              setTimeout(() => URL.revokeObjectURL(csvUrl), 100);
              setCsvUrl("");
            }}
          >
            Download CSV
          </a>
        )}
      </main>
    </div>
  );
}
