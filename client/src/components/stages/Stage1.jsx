import { Button, Card, Container, Badge } from "react-bootstrap";

function Stage1({ onNext, loggedIn, user }) {
  const handlePlay = () => {
    if (loggedIn && user.coins === 0) {
      alert("🚫 You don’t have enough coins to start the game!");
    } else {
      onNext();
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "85vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Card
        className="shadow-lg text-center p-4"
        style={{
          maxWidth: "500px",
          minHeight: "350px",
          borderRadius: "15px",
          background: "linear-gradient(135deg, #4a90e2 0%, #6fb1fc 100%)",
          color: "white",
          animation: "popIn 0.5s ease-out",
          marginTop: "-70px",
        }}
      >
        <Card.Body>
          <h2 style={{ fontWeight: "700", marginBottom: "20px" }}>
            🎯Ready for a Challenge?
          </h2>
          <Card.Text className="mb-3 fw-bold" style={{ fontSize: "1.1rem" }}>
            🧠 Test your wits and see if you can uncover the hidden sentence!
          </Card.Text>
          <Card.Text className="mb-3" style={{ fontSize: "1rem" }}>
            Try to{" "}
            <Badge bg="warning" text="dark">
              guess the secret sentence
            </Badge>{" "}
            and prove your intelligence.
          </Card.Text>
          <Card.Text className="mb-4" style={{ fontSize: "1rem" }}>
            Focus, think fast ⚡, and don’t miss any letter! ✍️
          </Card.Text>
          <Button
            onClick={handlePlay}
            size="md"
            style={{
              backgroundColor: "#6fcf97", // lighter green
              borderColor: "#6fcf97",
              fontWeight: "600",
              width: "180px",
            }}
          >
            🎮 Play Now
          </Button>
        </Card.Body>
      </Card>

      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Container>
  );
}

export default Stage1;
