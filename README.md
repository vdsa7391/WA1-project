[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9bh6fYH1)
# Exam #3:"Guess a Sentence"
## Student: s337806 RATHORE KHUSHBOO 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification

- Route`/`: 
  - Page content and purpose: Main game page.
   - The Header is always visible (except on the login page).
     - If not logged in: shows a Login button.
     - If logged in: shows username, matches played, user coins, and Logout button.
   - The body of / dynamically changes depending on the active game stage:
     - Stage 1: Game poster with description and “Play Now” button.
     - Stage 2: Rules page with game instructions and “Start” button.
     - Stage 3: The actual game component with masked sentence, alphabet table, and a 60-second countdown timer.
     - Stage 4: Result page showing win/lose outcome, penalties/rewards with a "play again" button.

- Route `/login`: 
  - Page content and purpose: Login page with a form for user authentication. Redirects to / if already logged in.

## API Server

1- POST `/api/login` - Authenticate a user and start session.
  - Request Body:
      {
      "email": email,
      "password": string
      }
  - Response body content: user object
  - Errors: 401 Unauthorized → incorrect username or password

2- POST `/api/logout` - End the current user session.
  - Request parameter & Body: None
  - Response: Empty  
  - Error: None    

3- GET `/api/alphabet`- Get all letters and their associated coin costs for the game.
  - request parameters - None
  - response body - array of alphabet with their cost -> { "A":10 , "B":2 ...}
  - Error: 500 Internal Server Error → failed to fetch the table

4- POST `/api/users/:userId/games` - Create a new game for a logged-in user.
  - request parameters: userId (integer)
  - response body: { "gameID" : Integer , "string" : String }  -> example of string: "__ _ __"
  - Errors:
      - 422 Unprocessable Entity → invalid userId
      - 503 Service Unavailable → failed to create the game

5- POST `/api/minigames` - Create a new mini-game for guest users.
  - request body: None
  - response body: { "miniGameID" : Integer , "string" : "maseked sentence" }  -> example of string: "__ _ __"
  - Error: 503 Service Unavailable → failed to create mini-game

6- POST `/api/users/:userId/games/:gameId/guess-letter` - Submit a letter guess for a logged-in user’s game.
  - Request Parameters: userId, gameId (integers)
  - Request Body:
      {
        "alphabet": character,
        "currentString": "_ _ _", // masked sentence string
        "coins": integer
      }
  - Response Body: Updated game state
      {
        updatedString: string
        message: string,  //game status: congratulation/correct guess/ wrong guess
        deductedCoins: integer,   // number of coiuns deducted
        remainingCoins: integer, //remainingCoins + 100 (in case of win),
        double: boolean, // not really used when win, but harmless
        gameOver: boolean, // game is over or not
        correctSentence: string, // correct sentence
        game_played: integer // only in case of win 
      }

7- POST `/api/users/:userId/games/:gameId/guess-sentence` - Submit a full sentence guess for a logged-in user’s game.
  - Request Parameters: userId, gameId (integers)
  - Request Body:
    {
      "sentence": "HELLO WORLD",
      "currentString": "_ E _ _ O"
    }
  - Response Body: Updated game state
    {
      message: string,
      deductedCoins: ineteger,
      remainingCoins: integer,
      gameOver: boolean,
      correctSentence: string,
      updatedString: string  // game_playes (integer) in case of win
    }

8- POST `/api/minigames/:miniGameId/guess-letter` -  Submit a letter guess in a mini-game for guest users.
  - Request Parameters: miniGameId (integer)
  - Request Body:
    {
      "alphabet": "A",
      "currentString": "_ _ _"
    }
  - Response Body: Updated mini-game state
    {
      updatedString: string,
      message: string,
      gameOver: boolean,
      correctSentence: string// only in case of win
    }

9- POST `/api/minigames/:miniGameId/guess-sentence` - Submit a sentence guess in a mini-game for guest users.
  - Request Parameters: miniGameId (integer)
  - Request Body:
    {
      "sentence": "HELLO WORLD",
      "currentString": "_ E _ _ O"
    }
  - Response Body: Updated mini-game state
    {
      message: string,
      gameOver: boolean,
      correctSentence/ updated string: string: 
    }

10- PATCH `/api/users/:userId/games/:gameId/end` - End or abort a logged-in user’s game.
  - Request Parameters: userId, gameId (integers)
  - Request Body:
    {
      "reason": string, //"aborted" or "time ended"
    }
  - Response Body: Final game state
    {
      message: string,// "time ended" or "aborted"
      deductedCoins: integer,
      remainingCoins: integer,
      gameOver: boolean,
      correctSentence: string, 
      game_played: integer
    }

11- PATCH `/api/minigames/:miniGameId/end` - End or abort a mini-game for guest users.
  - Request Parameters: miniGameId (integer)
  - Request Body:
    {
      "reason": string, // "aborted" or "time ended"
    }
  - Response Body: Final mini-game state
    {
      message: string, // "time ended"  or "aborted",
      gameOver: boolean,
      correctSentence: string
    }

** Errors for API [6-11] is same as API [4]

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

- Table user – contains authentication and player stats
  - id (INTEGER, PK, AUTOINCREMENT) – unique user identifier
  - username (TEXT, UNIQUE, NOT NULL) – display name
  - email (TEXT, UNIQUE, NOT NULL) – login email
  - salt (TEXT, NOT NULL) – per-user salt for password hashing
  - saltedPassword (TEXT, NOT NULL) – hashed password
  - coins (INTEGER, default 100) – current coin balance
  - game_played (INTEGER, default 0) – total games played

- Table alphabet – contains available letters and their costs
  - alphabet (TEXT, PK) – letter of the alphabet
  - cost (INTEGER, NOT NULL) – cost of guessing the letter

- Table games – contains logged-in users’ game sessions
  - gameid (INTEGER, PK, AUTOINCREMENT) – unique game ID
  - s_id (INTEGER, FK → sentences.s_id) – target sentence ID
 - result (TEXT, default "ongoing") – game result status
  - userid (INTEGER, FK → user.id) – owner of the game

- Table minigames – contains anonymous (non-logged-in) game sessions
  - minigameid (INTEGER, PK, AUTOINCREMENT) – unique mini-game ID
  - s_id (INTEGER, FK → sentences.s_id) – target sentence ID
  - result (TEXT, default "ongoing") – mini-game result status

- Table sentences – contains the pool of guessable sentences
  - s_id (INTEGER, PK, AUTOINCREMENT) – sentence ID
  - text (TEXT, NOT NULL) – sentence content
  - length (INTEGER, NOT NULL) – sentence length


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (u1@gmail.com, password)
- username, password (u2@gmail.com, password)
- username, password (u3@gmail.com, password)
- username, password (u4@gmail.com, password)
- username, password (u5@gmail.com, password)
