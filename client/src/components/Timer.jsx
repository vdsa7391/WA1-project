/* import { ProgressBar } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Timer({ duration, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    if (timeLeft <= 10) {
      const blinkTimer = setInterval(() => setBlink((b) => !b), 500);
      return () => clearInterval(blinkTimer);
    }

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="text-center mt-3">
      <h5 style={{ color: timeLeft <= 10 && blink ? "red" : "inherit" }}>
        Time left: {timeLeft}s
      </h5>
      <ProgressBar now={percentage} />
    </div>
  );
}
 */

import { ProgressBar } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Timer({ duration, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]); // runs once when Timer mounts

  useEffect(() => {
    if (timeLeft > 10) return;

    const blinkTimer = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkTimer);
  }, [timeLeft]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="text-center mt-3">
      <h5 style={{ color: timeLeft <= 10 && blink ? "red" : "inherit" }}>
        Time left: {timeLeft}s
      </h5>
      <ProgressBar now={percentage} />
    </div>
  );
}

