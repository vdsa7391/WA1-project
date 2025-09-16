

import { Button, Card, Badge } from "react-bootstrap";

export default function Stage4({loggedIn, gameResult, onPlayAgain }) {
  if (!gameResult) {
    return <p className="text-center mt-4">Loading game result...</p>;
  }

  return (
    <div className="d-flex justify-content-center mt-5 pb-5">
      <Card 
        className="shadow-lg text-center p-3"
        style={{ maxWidth: '450px', width: '100%', borderRadius: '15px', backgroundColor: '#f8f9fa' }}
      >
        <Card.Body>
          <Card.Title className="mb-4" style={{ fontSize: '1.8rem', fontWeight: '700' }}>
            Game Over
          </Card.Title>

          {gameResult?.message === "congratulation" && (
            <>
              <h3 className="mb-4">🎉 CONGRATULATIONS</h3>
              {loggedIn && <h5 className="mb-5"> You win <Badge bg="success">100 coins</Badge></h5> }
              <h4 className="mb-3">Thank you for playing!!</h4>

            </>
          )}

          {gameResult?.message === "aborted" && (
            <>
              <h5 className="mb-3">🏳️ Game aborted</h5>
              { gameResult.remainingCoins !== undefined && <p>Remaining coins: <strong>{gameResult.remainingCoins}</strong></p>}
            </>
          )}

          {gameResult?.message === "time ended" && (
            <>
              <h5 className="mb-3">⏰TIME'S UP</h5>
              <h4 className="mt-3 text-success">Well played !!</h4>
              <br />
              { gameResult.deductedCoins ? (<p>Penalty {"\u2264"} <strong className="text-danger">20 coins</strong></p>) : <></> }
              { gameResult.remainingCoins !== undefined && <p>Remaining coins: <strong>{gameResult.remainingCoins}</strong></p>}
    
            </>
          )}

          {gameResult?.correctSentence && (
            <div className="d-flex justify-content-center my-4">
              <Card 
                className="shadow border-success text-center" 
                style={{ width: '320px', backgroundColor: '#e9f7ef', borderRadius: '10px' }}
              >
                <Card.Body>
                  <Card.Title 
                    className="mb-3" 
                    style={{ textDecoration: 'underline', fontWeight: '600' }}
                  >
                    Correct Answer
                  </Card.Title>
                  <Card.Text 
                    style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '10px' }}
                  >
                    <em>{gameResult.correctSentence}</em>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          )}

          <div className="mt-4 d-flex justify-content-center gap-2">
            <Button variant="success" onClick={onPlayAgain}>Play Again</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
