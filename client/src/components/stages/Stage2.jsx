

import { Button, Card, ListGroup, Container, Badge } from "react-bootstrap";
import { startGame, startMiniGame } from "./../../API/Api.js";

function Stage2({ loggedIn, user, userLoaded, onStart, setGameData }) {

  const handleStart = async () => {
    try {
      let data;
      if (loggedIn) {
        data = await startGame(user.id);
      } else {
        data = await startMiniGame();
      }
      setGameData(data);
      onStart();
    } catch (err) {
      alert("Error starting game: " + err);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-start"
      style={{ minHeight: "100vh", paddingTop: "25px" }} // reduced top gap
    >
      <Card
        className="shadow-lg"
        style={{
          width: "650px", // wider card
          borderRadius: "15px",
          overflow: "hidden",
          fontSize: "0.9rem",
          backgroundColor: "#ffffff",
        }}
      >
        <Card.Header
          className="text-center text-white"
          style={{
            background: "linear-gradient(135deg, #4a90e2 0%, #6fb1fc 100%)",
            fontWeight: "700",
            fontSize: "1.3rem",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            padding: "12px 0",
          }}
        >
          Game Rules
        </Card.Header>

        <Card.Body style={{ padding: "15px 25px" }}>
          {loggedIn && userLoaded && (
            <p className="text-center mb-2" style={{ fontSize: "1rem" }}>
              💰 Coins: <strong>{user.coins}</strong>
            </p>
          )}

          <ListGroup variant="flush">
            {loggedIn ? (
              <>
                <ListGroup.Item>Guess a secret sentence in each match.</ListGroup.Item>
                <ListGroup.Item><strong>Goal:</strong> Fill all blanks correctly.</ListGroup.Item>
                <ListGroup.Item>Time limit: <Badge bg="warning" text="dark">60s</Badge></ListGroup.Item>
                <ListGroup.Item>
                  <strong>Actions:</strong>
                  <ul className="mt-1 mb-0" style={{ paddingLeft: "18px" }}>
                    <li>Guess a letter: <Badge bg="info">Vowels 10</Badge>, <Badge bg="secondary">Consonants 1–5</Badge>. Wrong guess doubles cost. Only 1 vowel/match.</li>
                    <li>Guess full sentence: <Badge bg="success">100 coins</Badge> if correct, no penalty if wrong.</li>
                    <li>Abandon match: No penalty.</li>
                  </ul>
                </ListGroup.Item>
                <ListGroup.Item>If time ends: <Badge bg="danger">20 coins</Badge> deducted (or all coins if less).</ListGroup.Item>
                <ListGroup.Item>Correct sentence is revealed after each match.</ListGroup.Item>
              </>
            ) : (
              <>
                <ListGroup.Item>Guess the secret sentence. Blanks = letters.</ListGroup.Item>
                <ListGroup.Item>Guess letters one by one or the full sentence.</ListGroup.Item>
                <ListGroup.Item>Time limit: <Badge bg="warning" text="dark">1 min</Badge></ListGroup.Item>
                <ListGroup.Item>No penalties for wrong guesses!</ListGroup.Item>
                <ListGroup.Item>Correct sentence revealed at the end.</ListGroup.Item>
              </>
            )}
          </ListGroup>

          {/* Start button flows inside the same card */}
          <div className="text-center mt-4">
            <Button
              onClick={handleStart}
              size="md" // smaller size
              variant="primary"
              style={{ fontWeight: "700", width: "100px" }} // fixed smaller width
            >
              🚀Start
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Stage2;

