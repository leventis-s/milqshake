"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const extractionOptions = ["Months", "Days", "Numbers", "Dates", "Other"];

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

export default function HomePage() {
  const [language, setLanguage] = useState("");
  const [extractionElement, setExtractionElement] = useState("");
  const [otherElement, setOtherElement] = useState("");
  const [englishFile, setEnglishFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csvUrl, setCsvUrl] = useState("");
  const [message, setMessage] = useState("");
  const [scriptType, setScriptType] = useState("");
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

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
        backgroundColor: "#fffde7", // light cream
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily: "Arial Black, Arial, sans-serif",
        color: "#222",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <main
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#fffde7", // keep form area white
          padding: "2rem",
          borderRadius: "8px",
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
            src="/milqshake-logo.png"
            alt="Milqshake logo"
            width={80}
            height={80}
            style={{ marginTop: "-0.5rem" }} // lift the logo slightly
          />
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Language input */}
          <label style={{ fontWeight: "bold" }}>
            Target Language:
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Enter target language"
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
          <label style={{ display: "block", margin: "1rem 0" }}>
            <input
              type="checkbox"
              checked={disclaimerChecked}
              onChange={(e) => setDisclaimerChecked(e.target.checked)}
              required
            />{" "}
            I have read and agree to the{" "}
            <Link
              style={{ textDecoration: "underline", color: "blue" }}
              href="/disclaimer"
            >
              disclaimer
            </Link>
            .
          </label>
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
