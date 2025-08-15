"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setStatus("Please fill in all fields.");
      return;
    }

    // Create mailto link
    const mailtoLink = `mailto:samanthaleventis@stanford.edu?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    // Open default email client
    window.location.href = mailtoLink;
    setStatus("Your email client should open. If not, please send manually to samanthaleventis@stanford.edu.");
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
          <h1 style={{ fontSize: "3rem", color: "#4da6ff" }}>MILQSHAKE</h1>
          <Image
            src="/milqshake-logo.png"
            alt="Milqshake logo"
            width={80}
            height={80}
            style={{ marginTop: "-0.5rem" }}
          />
        </div>

        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Contact Us</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          We would love to hear from you! For technical difficulties, media inquiries, or other questions, please use the form below or send an email directly to{" "}
          <a href="mailto:samanthaleventis@stanford.edu" style={{ color: "#4da6ff", textDecoration: "underline" }}>
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
            Subject:
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
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
            Send Message
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
