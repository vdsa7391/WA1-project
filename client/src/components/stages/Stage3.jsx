import { useEffect, useState, useRef } from "react";
import { Row, Col, Button, Form, Card, Badge } from "react-bootstrap";
import {
  guessLetterGame,
  guessSentenceGame,
  guessLetterMini,
  guessSentenceMini,
  endGame,
  endMini,
} from "../../API/Api.js";

function Stage3({
  loggedIn,
  user,
  gameId,
  miniGameId,
  initialString,
  onFinish,
  onCoinsUpdate,
  onTimeUpSignal,
  setTimerActive,
  alphabetTable,
  onGameQuantityUpdate,
}) {
  const [flash, setFlash] = useState(null);
  const [masked, setMasked] = useState(initialString || "");
  const [alphabet, setAlphabet] = useState("");
  const [sentence, setSentence] = useState("");
  const [busy, setBusy] = useState(false);
  const [vowelUsed, setVowelUsed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const hasFiredRef = useRef(false);

  const [letterCost, setLetterCost] = useState(0);

  useEffect(() => {
    if (!alphabet) return setLetterCost(0);
    const cost = alphabetTable[alphabet.toLowerCase()] || 0;
    setLetterCost(cost);
  }, [alphabet, alphabetTable]);


  const flipDelay = 1500;

  function resetInputs() {
    setAlphabet("");
    setSentence("");
  }

  // --- handleLetter, handleSentence, handleAbort, onTimeUp --- 
 
  function resetInputs() {
    setAlphabet("");
    setSentence("");
  }

  // ------------------- Letter / Sentence / Abort / TimeUp handlers -------------------
  async function handleLetter() {
    if (!alphabet || !/^[a-zA-Z]$/.test(alphabet)) return;
    const isVowel = "AEIOU".includes(alphabet.toUpperCase());
    if (vowelUsed && isVowel) {
      setFeedback({ message: "Only one vowel per game is allowed", type: "danger" });
      setTimeout(() => setFeedback(null), 2000);
      resetInputs();
      return;
    }
    setBusy(true);
    try {
      let res;
      if (loggedIn) {
        res = await guessLetterGame(user.id, gameId, alphabet, masked, user.coins);
        if (onCoinsUpdate) onCoinsUpdate(res.remainingCoins);
        if (res.game_played !== undefined && onGameQuantityUpdate) onGameQuantityUpdate(res.game_played);
      } else {
        res = await guessLetterMini(miniGameId, alphabet, masked);
      }

      if (isVowel && !vowelUsed) setVowelUsed(true);
      if (res.gameOver) {
        setTimerActive(false);
        onFinish(res);
        return;
      }

      setFlash({
        type: res.message === "wrong guess" ? "wrong" : "correct",
        msg: res.message === "wrong guess" ? "❌ Wrong guess" : "✅ Correct guess",
        deducted: res.deductedCoins,
        remaining: res.remainingCoins,
        double: !!res.double,
      });

      if (typeof res.updatedString === "string") setMasked(res.updatedString);
      setTimeout(() => setFlash(null), flipDelay);
    } catch (e) {
      setFlash({ type: "error", msg: String(e) });
      setTimeout(() => setFlash(null), 2000);
    } finally {
      setBusy(false);
      resetInputs();
    }
  }

  async function handleSentence() {
    if (!sentence.trim()) return;
    setBusy(true);
    try {
      let res;
      if (loggedIn) {
        res = await guessSentenceGame(user.id, gameId, sentence, masked);
        if (res.remainingCoins !== undefined && onCoinsUpdate) onCoinsUpdate(res.remainingCoins);
        if (res.game_played !== undefined && onGameQuantityUpdate) onGameQuantityUpdate(res.game_played);
      } else {
        res = await guessSentenceMini(miniGameId, sentence, masked);
      }
      if (res.gameOver) {
        setTimerActive(false);
        onFinish(res);
        return;
      }
      setFlash({
        type: "wrong",
        msg: "❌ Wrong guess",
        deducted: res.deductedCoins || 0,
        remaining: res.remainingCoins,
        double: false,
      });
      setTimeout(() => setFlash(null), flipDelay);
    } catch (e) {
      setFlash({ type: "error", msg: String(e) });
      setTimeout(() => setFlash(null), 2000);
    } finally {
      setBusy(false);
      resetInputs();
    }
  }

  async function handleAbort() {
    setBusy(true);
    try {
      let res;
      if (loggedIn) res = await endGame(user.id, gameId, "aborted");
      else res = await endMini(miniGameId, "aborted");

      if (loggedIn && res.game_played !== undefined && onGameQuantityUpdate) onGameQuantityUpdate(res.game_played);

      setTimerActive(false);
      onFinish(res);
    } catch (e) {
      setFlash({ type: "error", msg: String(e) });
      setTimeout(() => setFlash(null), 2000);
    } finally {
      setBusy(false);
    }
  }

  async function onTimeUp() {
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;
    setBusy(true);
    try {
      let res;
      if (loggedIn) res = await endGame(user.id, gameId, "time ended");
      else res = await endMini(miniGameId, "time ended");

      if (loggedIn && res.remainingCoins !== undefined && onCoinsUpdate) onCoinsUpdate(res.remainingCoins);
      if (res.game_played !== undefined && onGameQuantityUpdate) onGameQuantityUpdate(res.game_played);

      onFinish(res);
      setTimerActive(false);
    } catch (e) {
      setFlash({ type: "error", msg: String(e) });
      setTimeout(() => setFlash(null), 2000);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (typeof onTimeUpSignal === "function") onTimeUpSignal(onTimeUp);
  }, []);



  const disabledInputs = !!flash || busy;

  return (<>

    <Card
        className="shadow-lg p-3"
        style={{
          width: "95%",        // increase the card width to occupy more horizontal space
          margin: "0 auto",    // center the card horizontally
          display: "flex",
          flexDirection: "row",
          gap: "10px",         // spacing between columns
        }}
      >
        {/* Column 1 - Vowels */}
       
        <div style={{ flex: "1 1 200px" }}>
          <Card className="h-100">
            <Card.Header className="text-center bg-info text-white">Vowels</Card.Header>
            <Card.Body>
              {Object.keys(alphabetTable)
                .filter((ch) => ["a", "e", "i", "o", "u"].includes(ch))
                .map((c) => (
                  <div
                    key={c}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 8px",
                      marginBottom: "6px",
                      background: "#f8f9fa",
                      borderRadius: "6px",
                    }}
                  >
                    <strong>{c.toUpperCase()}</strong>
                    {loggedIn && (
                      <Badge bg="info">{alphabetTable[c]}</Badge>
                    )}
                  </div>
                ))}
            </Card.Body>
          </Card>
        </div>

        {/* Column 2 - Stage3 game */}
        <div style={{ flex: "2 1 300px" }}>
          <Card className="shadow-sm mb-3">
                <Card.Body className="text-center">
                  {/* Sentence / Flash Card */}
                  {flash ? (
                    <>
                      <h4 className="mb-3">{flash.msg}</h4>
                      {(flash.type === "wrong" || flash.type === "correct") &&
                        loggedIn && (
                          <div className="mt-2">
                            <div className="mb-2">
                              {flash.double ? "2 x " : ""}Cost deducted:{" "}
                              <Badge
                                bg={flash.double ? "danger" : "secondary"}
                              >
                                {flash.deducted}
                              </Badge>
                            </div>
                            <div>
                              Remaining coins:{" "}
                              <Badge bg="success">{flash.remaining}</Badge>
                            </div>
                          </div>
                        )}
                      {(flash.type === "wrong" || flash.type === "correct") && (
                        <div className="text-muted mt-3">
                          {flash.type === "wrong" ? "Try Again!!" : "Well done!"}
                        </div>
                      )}
                      {flash.type === "error" && (
                        <div className="text-danger">Something went wrong.</div>
                      )}
                    </>
                  ) : (
                    <>
                      <h5 className="mb-2">Sentence to guess:</h5>
                      <div className="border rounded p-3 fs-5">{masked}</div>
                      {feedback && (
                        <p className={`alert alert-${feedback.type}`}>
                          {feedback.message}
                        </p>
                      )}
                    </>
                  )}

                  {!flash && (
                    <Row className="mt-3">
                      <Col xs={12} className="mb-3">
                        <h6>Choose a letter:</h6>
                        {/* <img
                          src={letterImg}
                          alt="alphabet reference"
                          className="img-fluid mb-2"
                        /> */}
                        <Form.Control
                          type="text"
                          maxLength={1}
                          value={alphabet}
                          onChange={(e) => {
                            const v = e.target.value;
                            setAlphabet(v);
                            if (v.length > 0) setSentence("");
                          }}
                          disabled={disabledInputs}
                        />
                        {loggedIn && alphabet && alphabetTable && (
                          <div className="mt-2">
                            <small>
                              {alphabetTable[alphabet.toLowerCase()] !== undefined
                                ? `Cost: ${alphabetTable[alphabet.toLowerCase()]} coins`
                                : "Not an alphabet"}
                            </small>
                          </div>
                        )}
                        <Button
                          className="mt-2"
                          onClick={handleLetter}
                          disabled={
                            disabledInputs ||
                            !alphabet ||
                            !alphabetTable ||
                            (loggedIn &&
                              user.coins <
                                (alphabetTable[alphabet.toLowerCase()] ||
                                  Infinity))
                          }
                        >
                          {loggedIn &&
                          user.coins < (alphabetTable[alphabet.toLowerCase()] || 0)
                            ? "Not enough coins"
                            : "Submit Letter"}
                        </Button>
                      </Col>

                      <Col xs={12}>
                        <h6>Guess the full sentence:</h6>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={sentence}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSentence(v);
                            if (v.length > 0) setAlphabet("");
                          }}
                          disabled={disabledInputs}
                        />
                        <Button
                          className="mt-2"
                          variant="success"
                          onClick={handleSentence}
                          disabled={disabledInputs || !sentence.trim()}
                        >
                          Submit Sentence
                        </Button>
                      </Col>
                    </Row>
                  )}

                  <Row className="mt-3">
                    <Col>
                      <Button
                        variant="outline-danger"
                        onClick={handleAbort}
                        disabled={busy}
                      >
                        Abort
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
        </div>

        {/* Column 3 - Consonants */}

        <div style={{ flex: "1 1 250px" }}>
          <Card className="h-100">
            <Card.Header className="text-center bg-warning text-dark">Consonants</Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)", // 3 neat columns
                  gap: "8px",
                  justifyItems: "center",
                }}
              >
                {Object.keys(alphabetTable)
                  .filter((ch) => !["a", "e", "i", "o", "u"].includes(ch))
                  .map((c) => (
                    <div
                      key={c}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: loggedIn ? "60px" : "40px",
                        padding: "4px",
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                      }}
                    >
                      <strong>{c.toUpperCase()}</strong>
                      {loggedIn && (
                        <Badge bg="secondary">{alphabetTable[c]}</Badge>
                      )}
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </div>

    </Card>

    </>
  );
  
}

export default Stage3;
