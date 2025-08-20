import Image from "next/image";

export default function InfoPage() {
  return (
    <main style={{ padding: "1rem", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <div style={{ marginLeft: "40px", marginRight: "40px"}}> {/* Adjust this value as needed */}
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <h1
          style={{
            fontSize: "3rem",
            marginBottom: "1.2rem",
            marginTop: "1.5rem",
            color: "#4da6ff",
            fontWeight: "bold",
            fontFamily: "Arial Black, Arial, sans-serif", // updated font
          }}
        >
          MILQSHAKE
        </h1>
        <Image
          src="/milqshake_transparent.png"
          alt="Milqshake logo"
          width={80}
          height={80}
          style={{ marginTop: ".9rem" }} // match ContactPage alignment
        />
        </div>

      {/* Overview / Purpose */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Overview & Purpose</h2>
        <p style={{ marginBottom: "1rem" }}>
        MILQSHAKE is a custom NLP extraction tool built to uncover valuable insights hidden within existing bilingual parallel corpora. Many large open datasets hold more than meets the eye, and MILQSHAKE takes a second look to identify important CLDR-relevant data that can be extracted, organized, and put to practical use.
        </p>
        <p>
        By processing a parallel corpus, MILQSHAKE extracts these pieces of Unicode CLDR data and presents them in a clean, easy-to-use CSV format. This allows contributors to quickly review, validate, and make use of the results without wading through overwhelming amounts of raw data.
        Beyond its technical capabilities, MILQSHAKE works closely with language communities, nonprofits, and small organizations to unlock insights from datasets that might otherwise remain untapped. It is designed to complement community efforts, streamline translation workflows, and make high-quality data more accessible for everyone involved.
        </p>
      </section>

      {/* Instructions */}
      <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Instructions</h2>
      <ul style={{ lineHeight: 1.6, paddingLeft: "1.5rem", listStyleType: "disc" }}>
        <li>
          <strong>Input your language</strong> – select the language you are working with.
        </li>
        <li>
          <strong>Select extracted terms</strong> – choose from predefined options or provide your own custom regex:
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", fontSize: "0.9rem"  }}>
            <li><strong>Months</strong> – Extract all month names: January, February, March, April, May, June, July, August, September, October, November, December</li>
            <li><strong>Days of the Week</strong> – Extract all weekday names: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday</li>
            <li><strong>Time Vocabulary</strong> – Extract basic time units: year, month, week, day, hour, minute, second</li>
            <li><strong>Relative Time Vocabulary</strong> – Extract phrases representing relative time: last year, this year, next year; last month, this month, next month; last week, this week, next week; yesterday, today, tomorrow; this hour, this minute, this second</li>
            <li>
              <strong>Other / Custom</strong> – Provide a custom regex. Examples:
              <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" , fontSize: "0.8rem" }}>
                <li>\b[A-Z][a-z]+ville\b – matches place names ending in &ldquo;ville&rdquo;</li>
                <li>\b\w{5}\b – matches words with 5 or more letters</li>
                <li>\b(?:happy|sad|angry|excited)\b – matches specific emotion words</li>
                <li>\b[A-Za-z]+(?:ing|ed)\b – matches words ending in &ldquo;ing&rdquo; or &ldquo;ed&rdquo;</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
            <strong>Prepare your corpus</strong> – ensure your bilingual parallel corpora are in a readable .txt format and neither file is over 2000 lines. To be parallel, each line in the English file must correspond exactly to the same line in the translated target language file. For example:
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: ".9rem", marginLeft: "2rem"}}>
              <div>
                <strong>English file:</strong>
                <div style={{
                  backgroundColor: "#f4f4f4",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "0.5rem",
                  fontFamily: "monospace",
                  width: "200px",
                  marginBottom: "1rem",
                  fontSize: ".8rem"
                }}>
                  Hello<br />
                  Good morning<br />
                  Thank you
                </div>
              </div>
              <div>
                <strong>Target (Spanish) file:</strong>
                <div style={{
                  backgroundColor: "#f4f4f4",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "0.5rem",
                  fontFamily: "monospace",
                  width: "200px",
                  marginBottom: "1rem",
                  fontSize: ".8rem"
                }}>
                  Hola<br />
                  Buenos días<br />
                  Gracias
                </div>
              </div>
            </div>
          </li>


          <li>
            <strong>Upload the files</strong> – use the MILQSHAKE interface to upload your English and target language files.
          </li>
          <li><strong>Run the extraction</strong> – start the process. Depending on the corpus size and extraction choices, this may take up to 20 minutes.</li>
          <li><strong>Download the results</strong> – export the processed data in CSV format for research, analysis, or other applications.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>FAQ</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> What type of corpora does MILQSHAKE support?</p>
        <p><strong>A:</strong> MILQSHAKE works with bilingual parallel corpora in .txt format.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> Can MILQSHAKE handle large datasets?</p>
        <p><strong>A:</strong> Yes. Processing time depends on the dataset size. Very large datasets may take up to 20 minutes.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> How can I extract my own desired terms?</p>
        <p><strong>A:</strong> Use the custom regex option to define your own extraction patterns. If you&apos;re not familiar with creating regexes, tools like <a
        href="https://rows.com/tools/regex-generator"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#4da6ff", textDecoration: "underline" }}
      >this regex generator</a> or <a
        href="https://chatgpt.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#4da6ff", textDecoration: "underline" }}
      > ChatGPT </a> can help.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> How can I get more involved in supporting digitally underrepresented languages?</p>
        <p><strong>A:</strong> You can contribute by helping to create and validate corpora, participating in community translation projects, or collaborating with organizations like SILICON that support digitally disadvantaged languages.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> Where can I find more information about MILQSHAKE and related tools?</p>
        <p><strong>A:</strong> Visit <a
        href="https://silicon.stanford.edu"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#4da6ff", textDecoration: "underline" }}
      >https://silicon.stanford.edu</a> for more resources and information.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> Can I use MILQSHAKE for languages not supported by major datasets?</p>
        <p><strong>A:</strong> Yes. MILQSHAKE is designed to work with any language, provided you have a bilingual parallel corpus in txt format. Custom regex extraction allows you to target terms even in less-resourced languages.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> What output formats does MILQSHAKE provide?</p>
        <p><strong>A:</strong> The extracted data is presented in a clean CSV format, ready for research, analysis, or further processing.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> Is MILQSHAKE free to use?</p>
        <p><strong>A:</strong> Yes. MILQSHAKE is freely available for research and community-driven language work.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p><strong>Q:</strong> I have other questions or need support. What should I do?</p>
        <p>
          <strong>A:</strong> No problem! You can reach out to us anytime via our <a 
            href="/contact" 
            style={{ color: "#4da6ff", textDecoration: "underline" }}
          >
            contact page
          </a> and we’ll get back to you.
        </p>
      </div>
    </section>

    </div>
    </main>
  );
}
