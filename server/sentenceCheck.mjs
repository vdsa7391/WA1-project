// backend/sentenceHelper.js
export function maskSentence(sentence) {
  return sentence.split("").map(ch => (ch === " " ? "\u00A0\u00A0" : "_")).join(" ");
}
  
/* export function maskSentence(sentence) {
  return sentence
    .split("")
    .map(ch => {
      if (ch === " ") return "\u00A0\u00A0";  // non-breaking spaces
      if (/[a-zA-Z0-9]/.test(ch)) return "_";       // underscore for letters/numbers
      return ch;                                    // keep punctuation
    })
    .join(" ");
} */



export function applyGuess(secretSentence, currentMasked, guess) {
  const s = secretSentence;
  const lower = s.toLowerCase();
  const g = guess.toLowerCase();

  let found = false;
  let updated = "";

  for (let i = 0; i < s.length; i++) {
    if (lower[i] === g) {
      updated += s[i];
      found = true;
    } else {
      updated += currentMasked[i];
    }
  }

  return { updatedString: updated, correct: found };
}

export function isSentenceComplete(masked) {
  return !masked.includes("_");
}

export function sentencesEqual(a, b) {
  // Spec says: sentence is case-insensitive; match must be exactly equal (ignoring case)
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
