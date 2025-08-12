import { doubleMetaphone } from "double-metaphone";
import unidecode from "unidecode";
import stringSimilarity from "string-similarity"; // for fuzzy matching
import { MONTH_NAMES, monthPattern, weekdayPattern, WEEKDAY_NAMES} from "./constants";
import { client } from "./openaiClient";
import { stringify } from "csv-stringify/sync";
import fs from "fs/promises";



// Extract all full month names from a sentence as a Set
export function extractAllMatches(sentence, pattern) {
    const matches = sentence.match(pattern);
    // Return unique matches as an array
    return [...new Set(matches || [])];
  }  

// Normalize text by removing all Unicode punctuation and trimming + capitalizing
export function normalize(text) {
  // Normalize Unicode to NFC form
  const normalized = text.normalize("NFC");

  // Remove all Unicode punctuation characters
  // Unicode categories starting with 'P' are all punctuation
  // JS doesn't have direct Unicode category support, so use a regex for punctuation:
  // We can use a regex based on Unicode punctuation ranges or a small helper lib, but simplest:
  
  // Here’s a regex that matches most punctuation characters:
  const punctuationRegex = /[\p{P}\p{S}]/gu;

  // Remove punctuation
  const withoutPunct = normalized.replace(punctuationRegex, "");

  // Trim whitespace and capitalize first letter of each word (title case)
  return withoutPunct
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Return true if prediction is fuzzily or phonetically similar to target.
 * Phonetic similarity is used only for Latin-script languages.
 * @param {string} prediction
 * @param {string} target
 * @param {string} script
 * @param {number} threshold - fuzzy similarity threshold (default 0.75)
 * @param {number} phoneticThreshold - phonetic similarity threshold (default 0.75)
 * @returns {boolean}
 */
export function isFuzzyMatch(
    prediction,
    target,
    script,               // 'latin' or 'non-latin'
    threshold = 0.75,
    phoneticThreshold = 0.75
  ) {
    if (!prediction || !target) return false;
  
    const normPred = unidecode(prediction.toLowerCase());
    const normTarget = unidecode(target.toLowerCase());
  
    const score = stringSimilarity.compareTwoStrings(normPred, normTarget);
    if (score >= threshold) return true;
  
    if (script === "latin") {
      const [predMeta] = doubleMetaphone(normPred);
      const [targetMeta] = doubleMetaphone(normTarget);
  
      if (predMeta && targetMeta) {
        const phoneticScore = stringSimilarity.compareTwoStrings(predMeta, targetMeta);
        if (phoneticScore >= phoneticThreshold) return true;
      }
    }
  
    return false;
  }
  
export function filterResults(dataDict) {
    const cleaned = {};
  
    for (const [key, words] of Object.entries(dataDict)) {
      const normKey = normalize(key).toLowerCase();
      const keptWords = [];
      const skippedSameAsKey = [];
  
      for (const word of words) {
        const normWord = normalize(word).trim();
  
        if (normWord === "") {
          console.log(`Skipping empty or whitespace-only word: '${word}' normalized to '${normWord}'`);
          continue;
        }
  
        if (/\d/.test(normWord)) {
          console.log(`Skipping word with digits: '${normWord}'`);
          continue;
        }
  
        if (normWord.toLowerCase() === normKey) {
          skippedSameAsKey.push(normWord[0].toUpperCase() + normWord.slice(1));
          continue;
        }
  
        keptWords.push(normWord[0].toUpperCase() + normWord.slice(1));
      }
  
      const totalAttempts = keptWords.length + skippedSameAsKey.length;
  
      if (totalAttempts > 0 && skippedSameAsKey.length / totalAttempts >= 0.9) {
        console.log(`✅ Keeping '${normKey[0].toUpperCase() + normKey.slice(1)}' for ${key} since ≥90% were identical`);
        keptWords.push(...skippedSameAsKey);
      }
  
      cleaned[key] = keptWords;
    }
  
    return cleaned;
  }

export async function extractTranslationsOneByOne(keyDict, delay = 1400, scriptType = "latin") {
    const gptResults = {};
    const topGptResults = {};
  
    for (const [key, sentencePairs] of Object.entries(keyDict)) {
      gptResults[key] = [];
      console.log(`Processing key: ${key}\n`);
      let topWord = null;
      let topCount = 0;
      let confidence = 0.0;
      let variants = [];
  
      for (const [engSent, tgtSent] of sentencePairs) {
        const prompt = `
  You are a helpful multilingual assistant. Your task is to extract the translation of the English word "${key}" from the following sentence pair.
  
  English: ${engSent}
  Translation: ${tgtSent}
  
  Please return ONLY the translation of the word "${key}" as it appears in the target sentence. Respond with just the word and no extra explanation.
  
  If you believe the word has a suffix or prefix, remove it and return just the base word.
  `;
  
        try {
          const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
          });
          const translated = response.choices[0].message.content.trim();
          gptResults[key].push(translated);
          console.log(`  Extracted translation: ${translated}\n`);
        } catch (error) {
          console.error(`Error for key '${key}':`, error);
          gptResults[key].push(null);
        }
  
        // Delay between requests
        await new Promise((r) => setTimeout(r, delay));
      }
  
      // Filter results
      const filteredWords = filterResults({ [key]: gptResults[key] })[key] || [];
  
      // Count occurrences manually using a plain JS object
      const counter = filteredWords.reduce((acc, word) => {
        if (!word) return acc; // skip null or empty if any
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      const total = filteredWords.length;
      if (total > 0) {
        // Convert counter to array of [word, count] pairs
        const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
  
        topCount = sorted[0][1];
        const tiedCandidates = sorted.filter(([word, count]) => count === topCount).map(([word]) => word);
  
        // Compute variants (>20%, not tied top words)
        variants = sorted
          .filter(([word, count]) => !tiedCandidates.includes(word) && (count / total > 0.2 || count > 2))
          .map(([word]) => word);
  
        if (tiedCandidates.length === 1) {
          topWord = tiedCandidates[0];
        } else {
          // Score tied candidates by fuzzy matches
          const similarityScores = {};
          for (const candidate of tiedCandidates) {
            const comparisons = tiedCandidates.concat(variants).filter((w) => w !== candidate);
            similarityScores[candidate] = comparisons.reduce(
              (acc, other) => acc + (isFuzzyMatch(candidate, other, scriptType) ? 1 : 0),
              0
            );
          }
          // Pick candidate with highest similarity score (tie-break by order)
          topWord = Object.entries(similarityScores).sort((a, b) => b[1] - a[1])[0][0];
        }
  
        confidence = topCount / total;
  
        // Recompute variants excluding the top word
        variants = sorted
          .filter(
            ([word, count]) =>
              word !== topWord && (count / total > 0.2 || count > 2 || isFuzzyMatch(word, topWord, scriptType))
          )
          .map(([word]) => word)
          .slice(0, 4);
      }
  
      topGptResults[key] = {
        canonical: topWord,
        variants,
        count: topCount,
        total,
        confidence,
      };
  
      console.log(`\nAll filtered translations for ${key}:`);
      filteredWords.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
      console.log(`Top translation: ${topWord} (confidence: ${confidence.toFixed(2)})`);
      console.log(variants.length ? `Variants: ${variants.join(", ")}` : "Variants: None");
      console.log("\n" + "-".repeat(40) + "\n");
    }
  
    return { gptResults, topGptResults };
  }  

/**
* Generates a CSV string summarizing translation comparisons for any key set.
* 
* @param {string[]} extractionKeys - Array of keys (e.g., months, weekdays).
* @param {Object} gptSummary - GPT summary object keyed by extraction keys.
* @returns {Object} 
*    {
*      finalTranslations: Object,
*      csvContent: string (CSV data)
*    }
*/
export async function extractTermsFromFiles(engFile, targetFile, extractFunc) {
    async function readFileAsText(file) {
        return fs.readFile(file.path, "utf-8");
    }
  
    const engText = await readFileAsText(engFile);
    const targetText = await readFileAsText(targetFile);
  
    const engLines = engText.split(/\r?\n/);
    const targetLines = targetText.split(/\r?\n/);
  
    if (engLines.length !== targetLines.length) {
      throw new Error("English and target files have different number of lines!");
    }
  
    const termDict = {};
  
    for (let i = 0; i < engLines.length; i++) {
      const engSentence = engLines[i].trim();
      const targetSentence = targetLines[i].trim();
      const extractedTerms = extractFunc(engSentence);
  
      for (const term of extractedTerms) {
        if (!termDict[term]) termDict[term] = [];
        termDict[term].push([engSentence, targetSentence]);
      }
    }
  
    return termDict;
  }

export function generateTranslationComparisonCsv(extractionKeys, gptSummary) {
    let csvContent = "Term,Confidence,Variants,Canonical\n";
  
    for (const term of Object.keys(gptSummary)) {
      const { confidence, variants, canonical } = gptSummary[term];
      const variantsStr = variants.length > 0 ? variants.join(", ") : "None";
      csvContent += `"${term}",${(confidence * 100).toFixed(1)},"${variantsStr}","${canonical}"\n`;
    }
  
    return csvContent;
  }