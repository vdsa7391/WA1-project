// backend/apis.js
import db from "./db.mjs";
import {
  maskSentence,
  applyGuess,
  isSentenceComplete,
  sentencesEqual,
} from "./sentenceCheck.mjs";

/* ---------------- Utilities ---------------- */

function getSentenceCount() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM sentences", [], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

function getSentenceBySid(s_id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT text FROM sentences WHERE s_id = ?", [s_id], (err, row) => {
      if (err) reject(err);
      else if (!row) reject(new Error("Sentence not found"));
      else resolve(row.text);
    });
  });
}

function getSidByGameId(gameId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT s_id FROM games WHERE gameid = ?", [gameId], (err, row) => {
      if (err) reject(err);
      else if (!row) reject(new Error("Game not found"));
      else resolve(row.s_id);
    });
  });
}

function getSidByMiniId(miniGameId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT s_id FROM minigames WHERE minigameid = ?",
      [miniGameId],
      (err, row) => {
        if (err) reject(err);
        else if (!row) reject(new Error("Mini-game not found"));
        else resolve(row.s_id);
      }
    );
  });
}

function getLetterCost(letter) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT cost FROM alphabet WHERE alphabet = ?",
      [letter.toUpperCase()],
      (err, row) => {
        if (err) reject(err);
        else if (!row) reject(new Error("Letter cost not found"));
        else resolve(row.cost);
      }
    );
  });
}

function getUserCoins(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT coins FROM user WHERE id = ?", [userId], (err, row) => {
      if (err) reject(err);
      else if (!row) reject(new Error("User not found"));
      else resolve(row.coins);
    });
  });
}

function incrementGamesPlayed(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE user SET game_played = game_played + 1 WHERE id = ?",
      [userId],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function getGamesPlayed(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT game_played FROM user WHERE id = ?", [userId], (err, row) => {
      if (err) reject(err);
      else if (!row) reject(new Error("User not found"));
      else resolve(row.game_played);
    });
  });
}




export function getAlphabetTable() {
  return new Promise((resolve, reject) => {
    const query = "SELECT alphabet, cost FROM alphabet"; // your column names
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching alphabet table:", err);
        return reject(err);
      }

      if (!rows || rows.length === 0) {
        return reject(new Error("Alphabet table is empty"));
      }

      const table = {};
      rows.forEach(row => {
        table[row.alphabet.toLowerCase()] = row.cost;
      });

      resolve(table);
    });
  });
}



function setUserCoins(userId, newCoins) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE user SET coins = ? WHERE id = ?",
      [newCoins, userId],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}


function setGameResult(gameId, result) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE games SET result = ? WHERE gameid = ?",
      [result, gameId],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function setMiniGameResult(miniGameId, result) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE minigames SET result = ? WHERE minigameid = ?",
      [result, miniGameId],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/* ------------- Creation (from earlier flow, dynamic range) ------------- */

export async function createGame(userId) {
  const total = await getSentenceCount();
  if (total < 4) throw new Error("Not enough sentences for logged-in games");

  const minId = 4;
  const maxId = total;
  const s_id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

  const text = await getSentenceBySid(s_id);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO games (s_id, result, userid)
       VALUES (?, 'ongoing', ?)`,
      [s_id, userId],
      function (err) {
        if (err) reject(err);
        else resolve({ gameId: this.lastID, string: maskSentence(text) });
      }
    );
  });
}

export async function createMiniGame() {
  const total = await getSentenceCount();
  const maxId = Math.min(3, total);
  if (maxId < 1) throw new Error("No sentences for mini-game");

  const s_id = Math.floor(Math.random() * maxId) + 1;
  const text = await getSentenceBySid(s_id);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO minigames (s_id, result) VALUES (?, 'ongoing')`,
      [s_id],
      function (err) {
        if (err) reject(err);
        else resolve({ miniGameId: this.lastID, string: maskSentence(text) });
      }
    );
  });
}

/* ------------------- Guessing: LOGGED-IN (coins) ------------------- */

export async function guessLetterLoggedIn({ userId, gameId, letter, currentString }) {
  // gather inputs
  const s_id = await getSidByGameId(gameId);
  const secret = await getSentenceBySid(s_id);
  const { updatedString, correct } = applyGuess(secret, currentString, letter);

  // coin math via alphabet table
  const baseCost = await getLetterCost(letter);
  
  const currentCoins = await getUserCoins(userId);

  const deduction = correct ? baseCost : baseCost * 2;
  
  const remainingCoins = Math.max(0, currentCoins - deduction);
  
  
  // check win
  if (isSentenceComplete(updatedString)) {
    // award 100 coins
    
    await setUserCoins(userId, remainingCoins + 100);
    await setGameResult(gameId, "win");
    await incrementGamesPlayed(userId);
    const updatedGamesPlayed = await getGamesPlayed(userId);


    return {
      updatedString: secret,           // reveal full official sentence
      message: "congratulation",
      deductedCoins: 0,
      remainingCoins: remainingCoins + 100,
      double: !correct, // not really used when win, but harmless
      gameOver: true,
      correctSentence: secret,
      game_played: updatedGamesPlayed 
    };
  }

  await setUserCoins(userId, remainingCoins).then(res => console.log("Resolved:", res))
  .catch(err => console.log("Rejected:", err));


  // ongoing round
  return {
    updatedString,
    message: correct ? "correct guess" : "wrong guess",
    deductedCoins: deduction,
    remainingCoins,
    double: !correct,
    gameOver: false,
    correctSentence: null
  };
}

export async function guessSentenceLoggedIn({ userId, gameId, sentence, currentString }) {
  const s_id = await getSidByGameId(gameId);
  const secret = await getSentenceBySid(s_id);
  const currentCoins = await getUserCoins(userId);

  if (sentencesEqual(secret, sentence)) {
    
    await setUserCoins(userId, currentCoins + 100);
    await setGameResult(gameId, "win");
    await incrementGamesPlayed(userId);
    const updatedGamesPlayed = await getGamesPlayed(userId);

    return {
      message: "congratulation",
      deductedCoins: 0,
      remainingCoins: currentCoins + 100,
      gameOver: true,
      correctSentence: secret,
      game_played: updatedGamesPlayed
    };
  }

  // wrong full-sentence guess: no penalty
  return {
    message: "wrong guess",
    deductedCoins: 0,
    remainingCoins: currentCoins,
    gameOver: false,
    correctSentence: null,
    updatedString: currentString
  };
}

/* ------------------- Guessing: MINI-GAME (no coins) ------------------- */

export async function guessLetterMini({ miniGameId, letter, currentString }) {
  const s_id = await getSidByMiniId(miniGameId);
  const secret = await getSentenceBySid(s_id);

  const { updatedString, correct } = applyGuess(secret, currentString, letter);

  if (isSentenceComplete(updatedString)) {
    await setMiniGameResult(miniGameId, "win");
    return {
      updatedString: secret,
      message: "congratulation",
      gameOver: true,
      correctSentence: secret
    };
  }

  return {
    updatedString: correct ? updatedString : currentString,
    message: correct ? "correct guess" : "wrong guess",
    gameOver: false
  };
}

export async function guessSentenceMini({ miniGameId, sentence, currentString }) {
  const s_id = await getSidByMiniId(miniGameId);
  const secret = await getSentenceBySid(s_id);

  if (sentencesEqual(secret, sentence)) {
    await setMiniGameResult(miniGameId, "win");
    return {
      message: "congratulation",
      gameOver: true,
      correctSentence: secret
    };
  }

  return {
    message: "wrong guess",
    gameOver: false,
    updatedString: currentString
  };
}

/* ------------------- End / Abort helpers ------------------- */

export async function endGameLoggedIn({ userId, gameId, reason }) {
  const currentCoins = await getUserCoins(userId);

  let deducted = 0;
  let remaining = currentCoins;

  if (reason === "time ended") {
    deducted = 20;
    remaining = Math.max(0, currentCoins - deducted);
    await setUserCoins(userId, remaining);
    await setGameResult(gameId, "lost");
    await incrementGamesPlayed(userId);

  } else if (reason === "aborted") {
    await setGameResult(gameId, "abort");
    await incrementGamesPlayed(userId);

    // remaining and deducted stay as currentCoins and 0
  } else {
    throw new Error("Invalid reason for ending game");
  }

  const s_id = await getSidByGameId(gameId);
  const secret = await getSentenceBySid(s_id);
  const updatedGamesPlayed = await getGamesPlayed(userId); 

  return {
    message: reason === "time ended" ? "time ended" : "aborted",
    deductedCoins: deducted,
    remainingCoins: remaining,
    gameOver: true,
    correctSentence: secret,
    game_played: updatedGamesPlayed 
  };
}



export async function endMiniGame({ miniGameId, reason }) {
  // reason: 'abort' | 'timeup'
  await setMiniGameResult(miniGameId, reason === "timeup" ? "lost" : "abort");

  const s_id = await getSidByMiniId(miniGameId);
  const secret = await getSentenceBySid(s_id);

  return {
    message: reason === "time ended" ? "time ended" : "aborted",
    gameOver: true,
    correctSentence: secret
  };
}
