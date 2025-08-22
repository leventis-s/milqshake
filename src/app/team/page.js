import Image from "next/image";

export default function TeamPage() {
  return (
    <main style={{ padding: "1rem", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              color: "#4da6ff",
              fontWeight: "bold",
              fontFamily: "Arial Black, Arial, sans-serif",
              margin: 0,
              marginTop: "1.35rem",
              marginBottom: "-.5rem"
            }}
          >
            MILQSHAKE
          </h1>
          <Image
            src="/milqshake_transparent.png"
            alt="Milqshake logo"
            width={80}
            height={80}
            style={{ marginTop: ".4rem" }}
          />
        </div>
      <div style={{ marginLeft: "80px", marginRight: "10px" }}>
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
          <div style={{ flexShrink: 0, marginTop: "1.1rem" }}>
            <Image
              src="/mullaney_headshot.jpeg"
              alt="Thomas S. Mullaney"
              width={360} // adjust size
              height={360}
            />
          </div>

          {/* Text on the right */}
          <div style={{ maxWidth: "750px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>
              Director of Stanford SILICON & MILQSHAKE Advisor
            </h2>
            <h3 style={{ fontSize: "1.3rem", marginTop: "0", marginBottom: "0.5rem" }}>
              Thomas S. Mullaney
            </h3>

            <p style={{ marginBottom: "1rem" }}>
              <a
                href="/Mullaney CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4da6ff", textDecoration: "underline", marginRight: "0.5rem" }}
              >
                CV
              </a>
              |
              <a
                href="mailto:tsmullaney@stanford.edu"
                style={{ color: "#4da6ff", textDecoration: "underline", marginLeft: "0.5rem" }}
              >
                tsmullaney [at] stanford.edu
              </a>
            </p>

            {/* Bio */}
            <p style={{ marginBottom: ".8rem" }}>
            Thomas S. Mullaney is a SILICON Co-PI and current Director. He is a Professor of Chinese History at Stanford University, Kluge Chair in Technology and Society at the Library of Congress, and a Guggenheim Fellow. He is the author or lead editor of 8 books, including The Chinese Computer: A Global History of the Information Age (MIT Press, 2024), Where Research Begins (University of Chicago Press, 2022, with Christopher Rea), The Chinese Typewriter: A History (MIT Press, 2017, winner of the Fairbank Prize), and Coming to Terms with the Nation: Ethnic Classification in Modern China (UC Press, 2010). He earned his BA and MA from the Johns Hopkins University, and his PhD from Columbia University. For the past 15 years, his research, publications, conference planning, and coursework have focused expressly on asymmetries in the global information and language technologies, with a keen focus on writing systems that have been systematically marginalized and excluded from the modern information age.  
            </p>
          </div>
          {/* Headshot on the left */}
          <div style={{ flexShrink: 0, marginTop: "1.2rem" }}>
            <Image
              src="/headshot_zoom.jpg"
              alt="Samantha Leventis"
              width={360} // adjust size
              height={380}
            />
          </div>

          {/* Text on the right */}
          <div style={{ maxWidth: "750px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.2rem", marginTop: ".2rem" }}>
              Project Manager & Lead Developer
            </h2>
            <h3 style={{ fontSize: "1.3rem", marginTop: "0", marginBottom: "0.5rem" }}>
              Samantha Leventis
            </h3>

            <p style={{ marginBottom: "1.1rem" }}>
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
            This passion has led me to Stanford SILICON, where I use my technical skills and linguistic knowledge to help expand digital support for underrepresented languages. Through projects like MILQSHAKE, I’ve discovered how reimagining and repurposing existing data can open new doors, sparking fresh approaches to longstanding challenges.
            </p>
            <p style={{ marginBottom: ".7rem" }}>
            As I enter my final year at Stanford, I look ahead to a future where I can bring my educational background to think creatively and confront complex, large-scale problems — building technologies that are not only powerful, but also inclusive and transformative.
            </p>
          </div>
          {/* Headshot on the left */}
          <div style={{ flexShrink: 0, marginTop: "1.8rem", marginBottom: "1.6rem" }}>
            <Image
              src="/tyler_headshot.jpeg"
              alt="Tyler Abernethy"
              width={360} // adjust size
              height={360}
            />
          </div>

          {/* Text on the right */}
          <div style={{ maxWidth: "750px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.2rem", marginTop: ".2rem" }}>
              Associate Web Developer
            </h2>
            <h3 style={{ fontSize: "1.3rem", marginTop: "0", marginBottom: "0.5rem" }}>
              Tyler Abernethy
            </h3>

            <p style={{ marginBottom: "1rem" }}>
              <a
                href="mailto:tylerga@stanford.edu"
                style={{ color: "#4da6ff", textDecoration: "underline", marginLeft: "0rem" }}
              >
                tylerga [at] stanford.edu
              </a>
            </p>

            {/* Bio */}
            <p style={{ marginBottom: "1rem" }}>
            I am a senior at Stanford studying Symbolic Systems, East Asian Studies, and Computer Science. I first became interested in language through studying Mandarin Chinese; seeing the differences in using Chinese versus English online showed me how central language is to the digital experience. With SILICON I’ve gotten to work on tools to introduce more languages to the online world, improving digital accessibility and inclusion.
            </p>
          </div>
          {/* Headshot on the left */}
          <div style={{ flexShrink: 0, marginTop: "1.2rem", marginBottom: "2rem"}}>
            <Image
              src="/neev_headshot.jpeg"
              alt="Neev Seedani"
              width={360} // adjust size
              height={360}
            />
          </div>

          {/* Text on the right */}
          <div style={{ maxWidth: "750px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.2rem", marginTop: ".2rem" }}>
              Graphic Contributor
            </h2>
            <h3 style={{ fontSize: "1.3rem", marginTop: "0", marginBottom: "0.5rem" }}>
              Neev Seedani
            </h3>

            <p style={{ marginBottom: "1rem" }}>
              <a
                href="mailto:neev@stanford.edu"
                style={{ color: "#4da6ff", textDecoration: "underline", marginLeft: "0rem" }}
              >
                neev [at] stanford.edu
              </a>
            </p>

            {/* Bio */}
            <p style={{ marginBottom: "1rem" }}>
            My name is Neev Seedani, and I’m a first-year student at Stanford University in the Design program. Born in Pakistan, I grew up speaking five languages, and my interest in linguistics and language endangerment stems from my very own village language, Oadki. I’m excited to work toward better digital inclusion of diverse languages.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
