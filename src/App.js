import React, { useState } from 'react';

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
  );
}

const styles = {
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
