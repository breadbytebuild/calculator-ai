import React, { useState, useEffect } from 'react';

function SobrietyTimer() {
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('sobrietyStartTime');
    return saved ? new Date(parseInt(saved)) : new Date();
  });
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - startTime;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setDuration(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const resetTimer = () => {
    const now = new Date();
    setStartTime(now);
    localStorage.setItem('sobrietyStartTime', now.getTime().toString());
  };

  const setCustomStartTime = () => {
    const input = prompt("Enter start date (YYYY-MM-DD):");
    if (input) {
      const customDate = new Date(input);
      if (!isNaN(customDate.getTime())) {
        setStartTime(customDate);
        localStorage.setItem('sobrietyStartTime', customDate.getTime().toString());
      } else {
        alert("Invalid date format. Please use YYYY-MM-DD.");
      }
    }
  };

  return (
    <div style={styles.timer}>
      <div>Sober for: {duration}</div>
      <button style={styles.timerButton} onClick={resetTimer}>Reset to Now</button>
      <button style={styles.timerButton} onClick={setCustomStartTime}>Set Custom Start</button>
    </div>
  );
}

function App() {
  const [display, setDisplay] = useState('0');

  const handleClick = (value) => {
    setDisplay(display === '0' ? value : display + value);
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleCalculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  return (
    <div style={styles.container}>
      <SobrietyTimer />
      <div style={styles.calculator}>
        <div style={styles.display}>{display}</div>
        <div style={styles.buttonGrid}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
            <button
              key={btn}
              style={styles.button}
              onClick={() => btn === '=' ? handleCalculate() : handleClick(btn)}
            >
              {btn}
            </button>
          ))}
          <button style={styles.button} onClick={handleClear}>C</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  timer: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  timerButton: {
    fontSize: '16px',
    margin: '10px 5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  calculator: {
    width: '240px',
    margin: '50px auto',
    border: '2px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
  },
  display: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '10px',
    padding: '10px',
    textAlign: 'right',
    fontSize: '20px',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '18px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
};

export default App;
