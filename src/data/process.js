import fs from "fs";

// Read CSV
const csv = fs.readFileSync("langcodes.csv", "utf8");

// Split into lines and remove header
const lines = csv.trim().split("\n");
lines.shift();

// Build dictionary
const langDict = {};
lines.forEach((line) => {
  const [language, code] = line.split(",");
  langDict[language] = code;
});

// Save to JSON file
fs.writeFileSync(
  "langcodes.json", // file name
  JSON.stringify(langDict, null, 2), // pretty-print JSON
  "utf8"
);

console.log("✅ langcodes.json saved!");

main();
