"use client";
import { useState } from "react";
import Link from "next/link";

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", top: "1rem", left: "1rem", zIndex: 1000 }}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          padding: 0,
        }}
        aria-label="Toggle Menu"
      >
        <span style={{ width: "25px", height: "3px", backgroundColor: "#333", borderRadius: "2px" }}></span>
        <span style={{ width: "25px", height: "3px", backgroundColor: "#333", borderRadius: "2px" }}></span>
        <span style={{ width: "25px", height: "3px", backgroundColor: "#333", borderRadius: "2px" }}></span>
      </button>

      {/* Menu items */}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "0.5rem",
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/info"
            style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
            onClick={() => setOpen(false)}
          >
            Info
          </Link>
          <Link
            href="/contact"
            style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}




