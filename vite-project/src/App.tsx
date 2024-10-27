import { useState } from "react";

import "./App.css";

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [cps, setCps] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false); // New state for disabling button
  const [selectedTime, setSelectedTime] = useState(1); // Selected time option

  const handleClick = () => {
    // Start the timer on the first click
    if (!timerStarted) {
      setTimerStarted(true);
      setClickCount(1); // Count the first click

      setTimeout(() => {
        const finalCps = clickCount / selectedTime;
        setCps(finalCps); // Store final clicks per 5 seconds result
        setTimerStarted(false); // Reset timer
        setButtonDisabled(true); // Disable button after timeout
      }, selectedTime * 1000);
    } else {
      // Increment click count for subsequent clicks within the 5 seconds
      setClickCount((prevCount) => prevCount + 1);
    }
  };
  const resetCounter = () => {
    setClickCount(0);
    setTimerStarted(false);
    setCps(0);
    setButtonDisabled(false);  
  };

  return (
    <>
      <h1>ClickoMeter</h1>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {[1, 5, 10, 30, 60].map((time) => (
          <button
            key={time}
            className={`button-custom ${
              selectedTime === time ? "selected" : ""
            }`}
            onClick={() => setSelectedTime(time)}
            disabled={timerStarted} // Disable time selection while timer is running
          >
            {time} Second{time > 1 ? "s" : ""}
          </button>
        ))}
      </div>
      <div>
        <h2>
          {cps !== null
            ? `Final Clicks per ${selectedTime} Seconds: ${
                clickCount / selectedTime
              }`
            : "Click to Start"}
        </h2>
        <button onClick={handleClick} disabled={buttonDisabled}>
          Click Me!
        </button>
      </div>
      <button
        className="button-custom"
        onClick={() => {
          resetCounter();
        }}
      >
        RESET
      </button>
      <h1>{clickCount}</h1>
    </>
  );
}

export default App;
