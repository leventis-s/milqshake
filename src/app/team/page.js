import Image from "next/image";

export default function TeamPage() {
  return (
    <main style={{ padding: "1rem", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <div style={{ marginLeft: "80px", marginRight: "10px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "4rem",
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
          <div style={{ flexShrink: 0, marginTop: "1.3rem" }}>
            <Image
              src="/headshot.jpg"
              alt="Samantha Leventis"
              width={400} // adjust size
              height={400}
            />
          </div>

          {/* Text on the right */}
          <div style={{ maxWidth: "750px" }}>
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
            Pursuing my M.Sc. in Computer Science at Stanford, I find inspiration in the ways technology can connect with — and transform — other fields. With a B.Sc. in Symbolic Systems, I’m drawn to the many ways knowledge takes form, from the structure of human language to the logic of computation, and how these perspectives can inform the design of AI and technical architectures.
            </p>
            <p style={{ marginBottom: "1rem" }}>
            This passion has led me to Stanford SILICON, where I use my technical background and linguistic knowledge to help expand digital support for underrepresented languages. Through projects like MILQSHAKE, I’ve discovered how reimagining and repurposing existing data can open new doors, sparking fresh approaches to longstanding challenges.
            </p>
            <p>
            As I enter my final year at Stanford, I look ahead to a future where I can bring my educational background to think creatively and confront complex, large-scale problems — building technologies that are not only powerful, but also inclusive and transformative.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
