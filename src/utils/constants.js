export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
export const WEEKDAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

// Base singular time vocabulary
export const time_vocab_singular = [
  "year", "month", "week", "day", "hour", "minute", "second"
];

// Naive pluralization: just add 's'
export const time_vocab_plural = time_vocab_singular.map(w => w + "s");

// All time words (singular + plural)
export const time_vocab = [...time_vocab_singular, ...time_vocab_plural];

export const relativeTimeNames = [
  "last year", "this year", "next year",
  "last month", "this month", "next month",
  "last week", "this week", "next week",
  "yesterday", "today", "tomorrow",
  "this hour", "this minute", "this second"
];

export const relTimeBaseword = {
  "last year": "year",
  "this year": "year",
  "next year": "year",
  "last month": "month",
  "this month": "month",
  "next month": "month",
  "last week": "week",
  "this week": "week",
  "next week": "week",
  "yesterday": "day",
  "today": "day",
  "tomorrow": "day",
  "this hour": "hour",
  "this minute": "minute",
  "this second": "second"
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const escapedNames = relativeTimeNames.map(escapeRegex);

const relTimePattern = `(?<!\\w)(?:${escapedNames.join('|')})(?![\\w'])`;

export const relativeTimePattern = new RegExp(relTimePattern, 'i'); // case-insensitive

export const weekdayPattern = new RegExp(
  `\\b(?:${WEEKDAY_NAMES.join("|")})\\b(?!'s)`,
  "gi"
);
  
export const monthPattern = new RegExp(
  `\\b(?:${MONTH_NAMES.join("|")})\\b(?!'s)`,
  "gi"
);

// All time words without possessive
export const timePatternAll = new RegExp(
  `\\b(?:${time_vocab.join("|")})\\b(?!'s?)`,
  "gi"
);
  
// Extra punctuation characters
export const extraPunct = "،«»“”‘’—–()";
  
// Standard ASCII punctuation (Python string.punctuation equivalent)
export const stringPunctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
  
// Combined punctuation string
export const allPunct = stringPunctuation + extraPunct;
  