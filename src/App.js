import React, { useState, useEffect } from 'react';

function SobrietyTimer({ onDurationChange }) {
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
      const newDuration = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setDuration(newDuration);
      onDurationChange(newDuration);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, onDurationChange]);

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

function ImageGenerator({ duration }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const generateImage = async () => {
      console.log('Initiating image generation for duration:', duration);
      try {
        const startTime = Date.now();
        const response = await fetch('http://localhost:3001/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `A person celebrating ${duration} of sobriety, inspirational, uplifting`,
          }),
        });
        const data = await response.json();
        const endTime = Date.now();
        
        console.log('Received response from server');
        console.log('Request duration:', (endTime - startTime) / 1000, 'seconds');
        console.log('New image URL:', data.imageUrl);
        
        setImageUrl(data.imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    };

    // Generate image immediately
    generateImage();

    // Set up interval for subsequent generations
    const interval = setInterval(generateImage, 20000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array

  return (
    <div style={styles.imageContainer}>
      {imageUrl ? (
        <img src={imageUrl} alt="Sobriety celebration" style={styles.image} />
      ) : (
        <p>Generating image...</p>
      )}
    </div>
  );
}

function App() {
  const [duration, setDuration] = useState('');

  return (
    <div style={styles.container}>
      <SobrietyTimer onDurationChange={setDuration} />
      <ImageGenerator duration={duration} />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
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
  imageContainer: {
    width: '300px',
    height: '300px',
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
};

export default App;