// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getUser } from './dao-user.mjs';
import session from 'express-session';


import {
  createGame,
  createMiniGame,
  guessLetterLoggedIn,
  guessSentenceLoggedIn,
  guessLetterMini,
  guessSentenceMini,
  endGameLoggedIn,
  endMiniGame,
  getAlphabetTable
} from "./dao.mjs";


// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));


// Allow requests only from this specific origin, our frontend running on localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));;


passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { 
  return cb(null, user);
  
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


// API for login , logout

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
      
      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});



app.post('/api/logout', (req, res) => {
  req.logout(() => {
    res.end();
  });
});



//     API 

/* ---------- get the alphabets at first render---------- */


app.get("/api/alphabet", async (req, res) => {
  try {
    const table = await getAlphabetTable(); // { letter: cost }
    res.json(table);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get alphabet table" });
  }
});


/* ---------- create game/minigame (from Stage2) ---------- */

app.post("/api/users/:userId/games", [ check("userId").isInt({ min:1 }) ], async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const out = await createGame(parseInt(req.params.userId,10));
    console.log(out);
    res.status(201).json(out); // { gameId, string }
  } catch (e) {
    console.error(e);
    res.status(503).json({ error: e.message || "Impossible to create the game." });
  }
});

app.post("/api/minigames", async (req,res)=>{
  try {
    const out = await createMiniGame();
    console.log(out);
    res.status(201).json(out); // { miniGameId, string }
  } catch (e) {
    console.error(e);
    res.status(503).json({ error: e.message || "Impossible to create the mini-game." });
  }
});

/* ---------- Stage3: guessing (LOGGED-IN) ---------- */

app.post(
  "/api/users/:userId/games/:gameId/guess-letter",
  [
    check("userId").isInt({ min: 1 }),
    check("gameId").isInt({ min: 1 }),
    check("alphabet").isAlpha().isLength({ min: 1, max: 1 }),
    check("currentString").isString().notEmpty(),
    check("coins").optional().isInt({ min: 0 }) // you can send it for UI, but server trusts DB
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const out = await guessLetterLoggedIn({
        userId: parseInt(req.params.userId,10),
        gameId: parseInt(req.params.gameId,10),
        letter: req.body.alphabet,
        currentString: req.body.currentString
      });
      res.json(out);
    } catch (e) {
      console.error(e);
      res.status(503).json({ error: "Impossible to process letter guess." });
    }
  }
);

app.post(
  "/api/users/:userId/games/:gameId/guess-sentence",
  [
    check("userId").isInt({ min: 1 }),
    check("gameId").isInt({ min: 1 }),
    check("sentence").isString().notEmpty(),
    check("currentString").isString().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const out = await guessSentenceLoggedIn({
        userId: parseInt(req.params.userId,10),
        gameId: parseInt(req.params.gameId,10),
        sentence: req.body.sentence,
        currentString: req.body.currentString
      });
      res.json(out);
    } catch (e) {
      console.error(e);
      res.status(503).json({ error: "Impossible to process sentence guess." });
    }
  }
);

/* ---------- Stage3: guessing (MINI-GAME) ---------- */

app.post(
  "/api/minigames/:miniGameId/guess-letter",
  [
    check("miniGameId").isInt({ min: 1 }),
    check("alphabet").isAlpha().isLength({ min:1, max:1 }),
    check("currentString").isString().notEmpty()
  ],
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const out = await guessLetterMini({
        miniGameId: parseInt(req.params.miniGameId,10),
        letter: req.body.alphabet,
        currentString: req.body.currentString
      });
      res.json(out);
    } catch (e) {
      console.error(e);
      res.status(503).json({ error: "Impossible to process mini letter guess." });
    }
  }
);

app.post(
  "/api/minigames/:miniGameId/guess-sentence",
  [
    check("miniGameId").isInt({ min: 1 }),
    check("sentence").isString().notEmpty(),
    check("currentString").isString().notEmpty()
  ],
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const out = await guessSentenceMini({
        miniGameId: parseInt(req.params.miniGameId,10),
        sentence: req.body.sentence,
        currentString: req.body.currentString
      });
      res.json(out);
    } catch (e) {
      console.error(e);
      res.status(503).json({ error: "Impossible to process mini sentence guess." });
    }
  }
);

/* ---------- End / Abort ---------- */

app.patch(
  "/api/users/:userId/games/:gameId/end",
  [ check("userId").isInt({min:1}), check("gameId").isInt({min:1}), check("reason").isIn(["aborted","time ended"]) ],
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
      const out = await endGameLoggedIn({
        userId: parseInt(req.params.userId,10),
        gameId: parseInt(req.params.gameId,10),
        reason: req.body.reason
      });
      res.json(out);
    } catch (e) {
      console.error(e);
      res.status(503).json({ error: "Impossible to end the game." });
    }
  }
);

app.patch(
  "/api/minigames/:miniGameId/end",
  [ check("miniGameId").isInt({min:1}), check("reason").isIn(["aborted","time ended"]) ],
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
      const out = await endMiniGame({
        miniGameId: parseInt(req.params.miniGameId,10),
        reason: req.body.reason
      });
      res.json(out);
    } catch (e) {
      console.error(e);
      res.status(503).json({ error: "Impossible to end the mini-game." });
    }
  }
);




// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});