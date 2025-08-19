import Image from "next/image";

export default function TeamPage() {
  return (
    <main style={{ padding: "1rem", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <div style={{ marginLeft: "40px", marginRight: "40px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              color: "#4da6ff",
              fontWeight: "bold",
              fontFamily: "Arial Black, Arial, sans-serif",
              margin: 0,
            }}
          >
            MILQSHAKE
          </h1>
          <Image
            src="/milqshake_transparent.png"
            alt="Milqshake logo"
            width={80}
            height={80}
            style={{ marginTop: "-.7rem" }}
          />
        </div>

        {/* Team Member Section */}
        <section
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
            marginBottom: "3rem",
            flexWrap: "wrap", // allows stacking on small screens
          }}
        >
          {/* Headshot on the left */}
          <div style={{ flexShrink: 0 }}>
            <Image
              src="/headshot.jpg"
              alt="Samantha Leventis"
              width={400} // adjust size
              height={400}
            />
          </div>

          {/* Text on the right */}
          <div style={{ maxWidth: "700px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>
              Project Manager & Lead Developer
            </h2>
            <h3 style={{ fontSize: "1.3rem", marginTop: "0", marginBottom: "0.5rem" }}>
              Samantha Leventis
            </h3>

            <p style={{ marginBottom: "1rem" }}>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4da6ff", textDecoration: "underline", marginRight: "0.5rem" }}
              >
                Resume
              </a>
              |
              <a
                href="mailto:samanthaleventis@stanford.edu"
                style={{ color: "#4da6ff", textDecoration: "underline", marginLeft: "0.5rem" }}
              >
                samanthaleventis [at] stanford.edu
              </a>
            </p>

            {/* Bio */}
            <p style={{ marginBottom: "1rem" }}>
              [Insert a brief biography here. Include your background, experience, and your role in the MILQSHAKE project.]
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
