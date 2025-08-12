import formidable from "formidable-serverless";
import { extractTermsFromFiles, generateTranslationComparisonCsv, extractTranslationsOneByOne } from "../../utils/parse";
import { monthPattern /*, other patterns if needed */ } from "../../utils/constants";

export const config = {
  api: { bodyParser: false }, // for file uploads
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing form data" });

    try {
      const { language, extractionElement, scriptType } = fields;
      console.log("Received files:", files);
      const englishFile = files.englishFile;
      const targetFile = files.targetFile;

      if (!englishFile || !targetFile) {
        res.status(400).json({ error: "Missing uploaded files." });
        return;
      }

      if (
        !englishFile?.name?.endsWith(".txt") ||
        !targetFile?.name?.endsWith(".txt")
      ) {
        res.status(400).json({ error: "Only .txt files are accepted." });
        return;
      }
      
      if (!language || !extractionElement || !scriptType || !englishFile || !targetFile) {
        return res.status(400).json({ error: "Missing required fields or files" });
      }

      // Choose extractor based on extractionElement
      let extractor;
      switch (extractionElement.toLowerCase()) {
        case "months":
          extractor = (sentence) => {
            const matches = sentence.match(monthPattern);
            return new Set(matches || []);
          };
          break;
        // add more cases like "days", "numbers" etc.
        default:
          extractor = () => new Set(); // or a simple extractor for "Other"
      }


      // Extract terms from uploaded files
      const termDict = await extractTermsFromFiles(englishFile, targetFile, extractor);

      // Use your GPT extraction (imported from utils)
      const { gptResults, topGptResults } = await extractTranslationsOneByOne(termDict, 1400, scriptType);

      // Generate CSV
      const csvContent = generateTranslationComparisonCsv(termDict, topGptResults);

      res.setHeader("Content-Disposition", `attachment; filename=translations_${language}.csv`);
      res.setHeader("Content-Type", "text/csv");
      res.status(200).send(csvContent);
    } catch (error) {
      console.error("API parse error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
