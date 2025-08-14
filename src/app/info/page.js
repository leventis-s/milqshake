import Image from "next/image";
import InfoBox from "../components/InfoBox";

export default function InfoPage() {
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
          backgroundColor: "#fffde7",
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
        <InfoBox />
      </main>
    </div>
  );
}
