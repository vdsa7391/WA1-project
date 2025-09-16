// backend/sentenceHelper.js
export function maskSentence(sentence) {
  return sentence.split("").map(ch => (ch === " " ? "\u00A0\u00A0\u00A0" : "_")).join(" ");
}
  

export function applyGuess(secretSentence, currentMasked, guess) {
  const lowerSecret = secretSentence.toLowerCase();
  const lowerGuess = guess.toLowerCase();

  let found = false;
  const maskedArr = currentMasked.split(" ");

  const updatedArr = maskedArr.map((ch, i) => {
    if (secretSentence[i] === " ") {
      return "\u00A0\u00A0\u00A0";
    }
    if (lowerSecret[i] === lowerGuess) {
      found = true;
      return secretSentence[i];
    }
    return ch;
  });

  const updatedString = updatedArr.join(" ");

  return { updatedString, correct: found };
}


export function isSentenceComplete(masked) {
  return !masked.includes("_");
}

export function sentencesEqual(a, b) {
  // Spec says: sentence is case-insensitive; match must be exactly equal (ignoring case)
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
