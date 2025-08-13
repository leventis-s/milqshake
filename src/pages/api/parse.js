import formidable from "formidable-serverless";
import { extractTermsFromFiles, generateTranslationComparisonCsv, extractTranslationsOneByOne, filterTemporalSeconds, inferSingularWithGPT } from "../../utils/parse";
import { monthPattern, weekdayPattern, timePatternAll, time_vocab_singular } from "../../utils/constants";

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
      const predefinedExtractionElements = new Set(["months", "days", "time", "numbers", "dates", "other"]);
      let extractor;
      let csvContent;

      if (!predefinedExtractionElements.has(extractionElement.toLowerCase())) {
        // Treat as custom regex
        try {
          const userRegex = new RegExp(extractionElement, "gi"); // 'g' for global, 'i' for case-insensitive
      
          extractor = (sentence) => {
            const matches = sentence.match(userRegex);
            return new Set(matches || []);
          };
        } catch (e) {
          return res.status(400).json({ error: "Invalid custom regex pattern. Refer to instructions page for examples of valid regexes." });
        }
      } else {
        switch (extractionElement.toLowerCase()) {
          case "months":
            extractor = (sentence) => {
              const matches = sentence.match(monthPattern);
              return new Set(matches || []);
            };
            break;
          // add more cases like "days", "numbers" etc.
          case "days":
            extractor = (sentence) => {
              const matches = sentence.match(weekdayPattern);
              return new Set(matches || []);
            };
            break;
          // Actually for time words
          case "numbers":
            extractor = (sentence) => {
              const matches = sentence.match(timePatternAll);
              return new Set(matches || []);
            };
            break;
          case "numbers":
            extractor = (sentence) => {
              const matches = sentence.match(timePatternAll);
              return new Set(matches || []);
            };
            break;
          // Actually for relative time words
          case "dates":
            extractor = (sentence) => {
              const matches = sentence.match(timePatternAll);
              return new Set(matches || []);
            };
            break;
          default:
            extractor = () => new Set(); // or a simple extractor for "Other"
        }
      }

      // Extract terms from uploaded files
      let termDict = await extractTermsFromFiles(englishFile, targetFile, extractor);

      if (extractionElement.toLowerCase() === "time") {
        termDict = await filterTemporalSeconds(termDict);
      }

      // Use your GPT extraction (imported from utils)
      const { topGptResults } = await extractTranslationsOneByOne(termDict, 1400, scriptType);

      // Do different workflow for time
      if (extractionElement.toLowerCase() === "numbers") {
        const inferredSingulars = {};
      
        for (const baseWord of time_vocab_singular) {
          const singularInfo = topGptResults[baseWord] || {};
          const pluralInfo = topGptResults[baseWord + "s"] || {};
      
          const singularCandidates = [
            singularInfo.canonical,
            ...(singularInfo.variants || [])
          ]
      
          const pluralCandidates = [
            pluralInfo.canonical,
            ...(pluralInfo.variants || [])
          ]
      
          // Combine candidates and remove duplicates
          const allCandidatesSet = new Set([...singularCandidates, ...pluralCandidates]);
          const allCandidates = Array.from(allCandidatesSet);
      
          let inferredCanonical;
      
          if (allCandidates.length === 1) {
            inferredCanonical = allCandidates[0];
          } else if (allCandidates.length === 0) {
            inferredCanonical = "—"; // Or whatever default you want
          } else {
            // Call your GPT function to infer singular form
            inferredCanonical = await inferSingularWithGPT(baseWord, singularCandidates, pluralCandidates);
          }
      
          // Variants exclude the canonical inferred
          const inferredVariants = allCandidates.filter(w => w !== inferredCanonical);
      
          inferredSingulars[baseWord] = {
            canonical: inferredCanonical,
            variants: inferredVariants,
            count: singularInfo.count || 1,
            total: singularInfo.total || 1,
            confidence: "N/A",
          };
      
          console.log(`✅ Inferred singular for '${baseWord}': ${inferredCanonical}`);
          if (inferredVariants.length) {
            console.log(`  Variants: ${inferredVariants.join(", ")}`);
          }
        }
      
        csvContent = generateTranslationComparisonCsv(inferredSingulars);
      } else {
        csvContent = generateTranslationComparisonCsv(topGptResults);
      }

      res.setHeader("Content-Disposition", `attachment; filename=translations_${language}.csv`);
      res.setHeader("Content-Type", "text/csv");
      res.status(200).send(csvContent);
    } catch (error) {
      console.error("API parse error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
