// User table
function User(id, username, email, salt, saltedPassword, coins = 100, game_played = 0) {
  this.id = id;
  this.username = username;
  this.email = email;
  this.salt = salt;
  this.saltedPassword = saltedPassword;
  this.coins = coins;
  this.game_played = game_played;
}

// Alphabet table
function Alphabet(alphabet, cost) {
  this.alphabet = alphabet;
  this.cost = cost;
}

// Games table
function Game(gameid, s_id, result = "ongoing", userid) {
  this.gameid = gameid;
  this.s_id = s_id;
  this.result = result;
  this.userid = userid;
}

// Minigames table
function MiniGame(minigameid, s_id, result = "ongoing") {
  this.minigameid = minigameid;
  this.s_id = s_id;
  this.result = result;
}

// Sentences table
function Sentence(s_id, text) {
  this.s_id = s_id;
  this.text = text;
}


export { User, Alphabet, Sentence, MiniGame, Game };