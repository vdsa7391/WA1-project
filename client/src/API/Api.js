const URI = 'http://localhost:3001/api' ;


// login

async function logIn(credentials) {

    const bodyObject = {
        email: credentials.email,
        password: credentials.password
    }
    const response = await fetch(URI + `/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyObject)
    })
    if (response.ok) {
        const user = await response.json();
        return user;

    } else {
        const err = await response.text()
        throw err;
    }
}


async function logout() {
    const response = await fetch(URI + `/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok)
        return null;
}


export async function getAlphabetTableAPI() {
  const r = await fetch(`${URI}/alphabet`);
  if (!r.ok) throw new Error("Failed to load alphabet table");
  return r.json(); // returns { a: 5, b: 3, c: 8, ... }
}


// Create a game for logged-in user
async function startGame(userId) {
  const response = await fetch(`${URI}/users/${userId}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // logged-in users need session/cookie
  });

  if (!response.ok) {
    let errMessage = await response.json();
    if (response.status === 422)
      errMessage = `${errMessage.errors[0].msg} for ${errMessage.errors[0].path}.`;
    else errMessage = errMessage.error;
    throw errMessage;
  }

  return await response.json(); // { gameId, string }
}

// Create a mini-game for non-logged user
async function startMiniGame() {
  const response = await fetch(`${URI}/minigames`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // no credentials: "include", since non-logged users don’t need session
  });

  if (!response.ok) {
    let errMessage = await response.json();
    if (response.status === 422)
      errMessage = `${errMessage.errors[0].msg} for ${errMessage.errors[0].path}.`;
    else errMessage = errMessage.error;
    throw errMessage;
  }

  return await response.json(); // { miniGameId, string }
}


// --- guessing (logged-in) ---
export async function guessLetterGame(userId, gameId, alphabet, currentString, coins) {
  const r = await fetch(`${URI}/users/${userId}/games/${gameId}/guess-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ alphabet, currentString, coins })
  });
  if (!r.ok) {
    let e = await r.json().catch(()=>({error:"Network error"}));
    if (r.status === 422) e = `${e.errors?.[0]?.msg} for ${e.errors?.[0]?.path}.`;
    else e = e.error || "Guess failed.";
    throw e;
  }
  return r.json();
}

export async function guessSentenceGame(userId, gameId, sentence, currentString) {
  const r = await fetch(`${URI}/users/${userId}/games/${gameId}/guess-sentence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ sentence, currentString })
  });
  if (!r.ok) {
    let e = await r.json().catch(()=>({error:"Network error"}));
    if (r.status === 422) e = `${e.errors?.[0]?.msg} for ${e.errors?.[0]?.path}.`;
    else e = e.error || "Guess failed.";
    throw e;
  }
  return r.json();
}

// --- guessing (minigame) ---
export async function guessLetterMini(miniGameId, alphabet, currentString) {
  const r = await fetch(`${URI}/minigames/${miniGameId}/guess-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alphabet, currentString })
  });
  if (!r.ok) {
    let e = await r.json().catch(()=>({error:"Network error"}));
    if (r.status === 422) e = `${e.errors?.[0]?.msg} for ${e.errors?.[0]?.path}.`;
    else e = e.error || "Guess failed.";
    throw e;
  }
  return r.json();
}

export async function guessSentenceMini(miniGameId, sentence, currentString) {
  const r = await fetch(`${URI}/minigames/${miniGameId}/guess-sentence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence, currentString })
  });
  if (!r.ok) {
    let e = await r.json().catch(()=>({error:"Network error"}));
    if (r.status === 422) e = `${e.errors?.[0]?.msg} for ${e.errors?.[0]?.path}.`;
    else e = e.error || "Guess failed.";
    throw e;
  }
  return r.json();
}

// --- end / abort ---
export async function endGame(userId, gameId, reason) {
  const r = await fetch(`${URI}/users/${userId}/games/${gameId}/end`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason })
  });
  if (!r.ok) {
    let e = await r.json().catch(()=>({error:"Network error"}));
    if (r.status === 422) e = `${e.errors?.[0]?.msg} for ${e.errors?.[0]?.path}.`;
    else e = e.error || "End failed.";
    throw e;
  }
  return r.json();
}

export async function endMini(miniGameId, reason) {
  const r = await fetch(`${URI}/minigames/${miniGameId}/end`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  });
  if (!r.ok) {
    let e = await r.json().catch(()=>({error:"Network error"}));
    if (r.status === 422) e = `${e.errors?.[0]?.msg} for ${e.errors?.[0]?.path}.`;
    else e = e.error || "End failed.";
    throw e;
  }
  return r.json();
}



export {logIn, logout,  startGame, startMiniGame};
