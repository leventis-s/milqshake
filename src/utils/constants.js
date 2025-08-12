export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
export const WEEKDAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];
  
export const weekdayPattern = new RegExp(`\\b(?:${WEEKDAY_NAMES.join("|")})\\b`, "gi");
  
// Regex pattern for matching months as whole words
export const monthPattern = new RegExp(`\\b(?:${MONTH_NAMES.join("|")})\\b`, "g");
  
// Extra punctuation characters
export const extraPunct = "،«»“”‘’—–()";
  
// Standard ASCII punctuation (Python string.punctuation equivalent)
export const stringPunctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
  
// Combined punctuation string
export const allPunct = stringPunctuation + extraPunct;
  