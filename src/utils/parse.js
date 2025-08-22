import { doubleMetaphone } from "double-metaphone";
import unidecode from "unidecode";
import stringSimilarity from "string-similarity"; // for fuzzy matching
import { client } from "./openaiClient";
import fs from "fs/promises";
import { relTimeBaseword } from "./constants";
import path from "path";

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
  
    if (script === "Latin") {
      const [predMeta] = doubleMetaphone(normPred);
      const [targetMeta] = doubleMetaphone(normTarget);
  
      if (predMeta && targetMeta) {
        const phoneticScore = stringSimilarity.compareTwoStrings(predMeta, targetMeta);
        if (phoneticScore >= phoneticThreshold) return true;
      }
    }
  
    return false;
  }

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function filterResults(dataDict) {
    const cleaned = {};
  
    for (const [key, words] of Object.entries(dataDict)) {
      const normKey = toTitleCase(normalize(key));
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
  
      if (totalAttempts > 0 && skippedSameAsKey.length / totalAttempts >= 0.6) {
        console.log(`✅ Keeping '${normKey[0].toUpperCase() + normKey.slice(1)}' for ${key} since ≥60% were identical`);
        keptWords.push(...skippedSameAsKey);
      }
  
      cleaned[toTitleCase(key)] = keptWords;
    }
  
    return cleaned;
  }

export async function extractTranslationsOneByOne(
    keyDict,
    delay = 1000,
    scriptType = "Latin",
    langCode,
    extractionElement
  ) {
    const gptResults = {};
    const topGptResults = {};

    // 🔹 If relative time vocab, load CLDR
    let cldrBaseWords = {};
    try {
      const cldrPath = path.join(
        process.cwd(),
        "src",
        "data",
        "cldr",
        langCode,
        "dateFields.json"
      );
      console.log("Looking for CLDR file at:", cldrPath);
      
      const cldrData = JSON.parse(await fs.readFile(cldrPath, "utf8"));
      console.log(`✅ Loaded CLDR data for ${langCode}`)
      for (const [relTimeWord, baseword] of Object.entries(relTimeBaseword)) {
        try {
          console.log(`➡️ Checking relTimeWord: "${relTimeWord}", baseword: "${baseword}"`);

          const cldrEntry =
            cldrData.main?.[langCode]?.dates?.fields?.[baseword.toLowerCase()];
          const cldrDisplay = cldrEntry?.displayName;

          // Only include if it's non-empty, and not the same as the relTimeWord
          if (
            cldrDisplay &&
            cldrDisplay.toLowerCase() !== relTimeWord.toLowerCase()
          ) {
            cldrBaseWords[relTimeWord] = cldrDisplay;
          }
          else {
            console.log(
              `   ⏩ Skipping because displayName "${cldrDisplay}" is same as relTimeWord "${relTimeWord}"`
            );
          }
        } catch {
          // skip if missing
        }
      }
      console.log("📦 Final cldrBaseWords:", cldrBaseWords);
    } catch (err) {
      console.warn(`⚠️ Could not load CLDR file for ${langCode}:`, err.message);
    }
  
    // 🔹 Main loop
    for (const [key, sentencePairs] of Object.entries(keyDict)) {
      gptResults[key] = [];
      console.log(`Processing key: ${key}\n`);
  
      let topWord = null;
      let topCount = 0;
      let confidence = "0/0";
      let variants = [];
  
      for (const [engSent, tgtSent] of sentencePairs) {
        let prompt = `
      You are a helpful multilingual assistant. Your task is to extract the translation of the English term "${key}" from the following sentence pair.
      
      English: ${engSent}
      Translation: ${tgtSent}
      `;
      
        // Add CLDR context if applicable
        if (extractionElement.toLowerCase() === "relative time vocabulary") {
          const baseWord = relTimeBaseword[key.toLowerCase()];
          const cldrBaseWord = key.toLowerCase() ? cldrBaseWords[key.toLowerCase()] : null;
      
          console.log("[RelTime Debug] key:", key.toLowerCase());
          console.log("[RelTime Debug] baseWord (from relTimeBaseword):", baseWord);
          console.log("[RelTime Debug] cldrBaseWord (from cldrBaseWords):", cldrBaseWord);
      
          // Only include CLDR context if it exists and differs from the baseWord
          if (cldrBaseWord && cldrBaseWord.toLowerCase() !== baseWord.toLowerCase()) {
            prompt += `
      
      Additional context: The term for "${baseWord}" is "${cldrBaseWord}".
      This may help in extracting "${key}", but don't be too attached to it.
      The term for "${key}" may be entirely different than the term for "${baseWord}".
      `;
          }
        }
      
        prompt += `
      Please return ONLY the translation of "${key}" as it appears in the target sentence.
      Do not give an explanation. If you believe the term has a suffix or prefix, remove it and return just the base term.
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
  
        await new Promise((r) => setTimeout(r, delay));
      }
  
      // Filter + tally results
      const filteredWords = filterResults({ [key]: gptResults[key] })[key] || [];
      const counter = filteredWords.reduce((acc, word) => {
        if (!word) return acc;
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      const total = filteredWords.length;
  
      if (total > 0) {
        const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
        topCount = sorted[0][1];
        const tiedCandidates = sorted.filter(([w, c]) => c === topCount).map(([w]) => w);
  
        variants = sorted
          .filter(([w, c]) => !tiedCandidates.includes(w) && (c / total > 0.2 || c > 2))
          .map(([w]) => w);
  
        if (tiedCandidates.length === 1) {
          topWord = tiedCandidates[0];
        } else {
          const similarityScores = {};
          for (const candidate of tiedCandidates) {
            const comparisons = tiedCandidates.concat(variants).filter((w) => w !== candidate);
            similarityScores[candidate] = comparisons.reduce(
              (acc, other) => acc + (isFuzzyMatch(candidate, other, scriptType) ? 1 : 0),
              0
            );
          }
          topWord = Object.entries(similarityScores).sort((a, b) => b[1] - a[1])[0][0];
        }
  
        confidence = `${topCount}/${total}`;
  
        variants = sorted
          .filter(
            ([w, c]) =>
              w !== topWord &&
              (c / total > 0.2 || c > 2 || isFuzzyMatch(w, topWord, scriptType))
          )
          .map(([w]) => w)
          .slice(0, 4);
        variants = variants.filter((v) => v && v.toLowerCase() !== "none");
      }
  
      topGptResults[key] = { canonical: topWord, variants, count: topCount, total, confidence };
  
      console.log(`\nAll filtered translations for ${key}:`);
      filteredWords.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
      console.log(`Top translation: ${topWord} (confidence: ${confidence})`);
      console.log(variants.length ? `Variants: ${variants.join(", ")}` : "Variants: None");
      console.log("\n" + "-".repeat(40) + "\n");
    }
  
    return { topGptResults };
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
  
      for (const ogTerm of extractedTerms) {
        const term = toTitleCase(ogTerm)
        if (!termDict[term]) termDict[term] = [];
        termDict[term].push([engSentence, targetSentence]);
      }
    }
  
    return termDict;
  }

export function generateTranslationComparisonCsv(gptSummary) {
  // New header
  let csvContent = "Term,Most Frequent,Frequency,Variants\n";
  
  for (const term of Object.keys(gptSummary)) {
    const { confidence, variants, canonical } = gptSummary[term];
  
    const mostFrequent = canonical || "-"; // canonical = most frequent
    const frequency = confidence ?? "-";   // confidence = frequency
    const variantsArr = Array.isArray(variants)
      ? variants.filter((v) => v && v.trim())
      : [];
    const variantsStr = variantsArr.length > 0 ? variantsArr.join(", ") : "-";
  
    csvContent += `"${term}","${mostFrequent}","${frequency}","${variantsStr}"\n`;
  }
  
  return csvContent;
}
  

async function isTemporalSecondGPT(sentence) {
    const prompt = `
  In the sentence below, is the word 'second' used to refer to a **unit of time** 
  (meaning 1/60th of a minute), and **not** as an ordinal (like 2nd place or second try)?
  
  Answer with 'Yes' or 'No'.
  
  Sentence: ${sentence}
  `;
  
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });
  
    const answer = response.choices[0].message.content.trim().toLowerCase();
    return answer.includes("yes");
  }

export async function filterTemporalSeconds(termDict) {
  // If there is no "second" key, return the dict as-is
  if (!termDict["second"]) return termDict;
  
  const filteredSecondEntries = [];
  
  // termDict["second"] is an array of [English sentence, target sentence]
  for (const [engSent, tgtSent] of termDict["second"]) {
    const isTemporal = await isTemporalSecondGPT(tgtSent); // check if target sentence is temporal
    if (isTemporal) {
      filteredSecondEntries.push([engSent, tgtSent]);
    }
  }
  
  // Return the dict with filtered "second" entries, everything else unchanged
  return {
    ...termDict,
    second: filteredSecondEntries,
  };
}
  

export async function inferSingularWithGPT(baseWord, singularCandidates, pluralCandidates) {
    // Combine candidates and count frequency
    const allCandidates = [...new Set([...singularCandidates, ...pluralCandidates].filter(Boolean))];
  
    // Prepare candidate lines for prompt
    const candidateLines = allCandidates
      .map(word => `- "${word}":`) // counts not included since JS doesn't have Counter; can be improved if needed
      .join("\n");
  
    const prompt = `
  You are a multilingual linguist assistant.
  
  The English word is: "${baseWord}", a singular time-related noun (e.g., day, week, year).
  
  Here are words that were extracted as possible translations of "${baseWord}" and "${baseWord}s" in another language:
  
  ${baseWord} candidates: ${JSON.stringify(singularCandidates)}
  ${baseWord}s candidates: ${JSON.stringify(pluralCandidates)}
  
  What is most likely translation of ${baseWord} in the target language?
  
  Please respond with only the singular word, and no explanation.
  `;
  
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });
  
      let singularGuess = response.choices[0].message.content.trim();
  
      // Normalize and title-case the guess
      singularGuess = normalize(singularGuess); // implement or import normalize
      singularGuess = toTitleCase(singularGuess)

      console.log("[inferSingularWithGPT] baseWord:", baseWord);
      console.log("  candidates:", { singularCandidates, pluralCandidates });
      console.log("  GPT raw response:", response.choices[0].message.content);
      console.log("  normalized guess:", singularGuess);

  
      return singularGuess;
    } catch (error) {
      if (error.name === "TimeoutError") {
        console.log(`Timeout on attempt '${baseWord}', retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        // optionally retry here or return null
      } else {
        console.error(`Error inferring singular for ${baseWord}:`, error);
      }
      return null;
    }
  }
  