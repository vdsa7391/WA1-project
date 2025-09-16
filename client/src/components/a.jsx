import { Card, Row, Col, Badge } from "react-bootstrap";

export default function AlphabetTable({ alphabetTable }) {
  if (!alphabetTable) return null;

  // Split vowels and consonants
  const vowels = Object.keys(alphabetTable).filter((l) => "AEIOU".includes(l.toUpperCase()));
  const consonants = Object.keys(alphabetTable).filter((l) => !"AEIOU".includes(l.toUpperCase()));

  const renderLetter = (letter) => (
    <Col xs={3} md={2} lg={1} className="mb-2 text-center" key={letter}>
      <Card className="shadow-sm p-2 border-0">
        <Card.Body className="p-1">
          <strong>{letter.toUpperCase()}</strong>
          <Badge bg="info" className="ms-1">{alphabetTable[letter]}</Badge>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="mb-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">Vowels</Card.Header>
        <Card.Body>
          <Row>
            {vowels.map(renderLetter)}
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mt-3">
        <Card.Header className="bg-secondary text-white">Consonants</Card.Header>
        <Card.Body>
          <Row>
            {consonants.map(renderLetter)}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
