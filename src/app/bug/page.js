"use client";

import { useState } from "react";
import Image from "next/image";

export default function BugReportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !bugDescription) {
      setStatus("Please fill in all required fields.");
      return;
    }

    const mailtoLink = `mailto:samanthaleventis@stanford.edu?subject=${encodeURIComponent(
      "Bug Report: " + bugDescription
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nBug Description:\n${bugDescription}\n\nSteps to Reproduce:\n${stepsToReproduce}`
    )}`;

    window.location.href = mailtoLink;
    setStatus(
      "Your email client should open. If not, please send manually to samanthaleventis@stanford.edu."
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#fffde7",
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily: "Arial, sans-serif",
        color: "#222",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <main
        style={{
          maxWidth: "700px",
          width: "100%",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              color: "#4da6ff",
              fontFamily: "Arial Black, Arial, sans-serif",
            }}
          >
            MILQSHAKE
          </h1>
          <Image
            src="/milqshake_transparent.png"
            alt="Milqshake logo"
            width={80}
            height={80}
            style={{ marginTop: "-1rem" }}
          />
        </div>

        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "1rem",
            fontFamily: "Arial Black, Arial, sans-serif",
          }}
        >
          Report a Bug
        </h2>

        <p style={{ marginBottom: "1.5rem", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
          Found an issue or unexpected behavior? Please fill out the form below with as much detail
          as possible, or email us directly at{" "}
          <a
            href="mailto:samanthaleventis@stanford.edu"
            style={{
              color: "#4da6ff",
              textDecoration: "underline",
              fontWeight: "normal",
              fontFamily: "Arial, sans-serif",
            }}
          >
            samanthaleventis@stanford.edu
          </a>
          .
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={{ fontWeight: "bold" }}>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <label style={{ fontWeight: "bold" }}>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <label style={{ fontWeight: "bold" }}>
            Bug Description:
            <textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              required
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                fontFamily: "Arial",
                resize: "vertical",
                backgroundColor: "white",
              }}
            />
          </label>

          <label style={{ fontWeight: "bold" }}>
            Steps to Reproduce (optional):
            <textarea
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                fontFamily: "Arial",
                resize: "vertical",
                backgroundColor: "white",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: "0.75rem",
              fontWeight: "bold",
              backgroundColor: "#4da6ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            Submit Bug
          </button>
        </form>

        {status && (
          <p
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              color: status.toLowerCase().includes("error") ? "red" : "blue",
            }}
          >
            {status}
          </p>
        )}
      </main>
    </div>
  );
}
