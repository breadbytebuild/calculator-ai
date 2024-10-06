import React, { useState, useEffect } from 'react';
import './App.css'; // We'll create this file for additional styles

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
    <div className="card timer-card">
      <h2>Sobriety Tracker</h2>
      <div className="duration">{duration}</div>
      <div className="button-group">
        <button className="button" onClick={resetTimer}>Reset</button>
        <button className="button" onClick={setCustomStartTime}>Custom Date</button>
      </div>
    </div>
  );
}

function ImageGenerator({ duration }) {
  const [imageUrl, setImageUrl] = useState('');
  const [nextImageUrl, setNextImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer;
    let isMounted = true;

    const generateImage = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
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
        
        if (isMounted) {
          if (!imageUrl) {
            console.log('Setting initial image');
            setImageUrl(data.imageUrl);
          } else {
            console.log('Setting next image');
            setNextImageUrl(data.imageUrl);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error generating image:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const updateImage = () => {
      if (nextImageUrl) {
        console.log('Updating displayed image');
        setImageUrl(nextImageUrl);
        setNextImageUrl('');
      }
    };

    const scheduleNextGeneration = () => {
      timer = setInterval(() => {
        updateImage();
        generateImage();
      }, 20000);
    };

    generateImage(); // Generate first image immediately
    scheduleNextGeneration(); // Schedule subsequent generations

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []); // Empty dependency array

  console.log('Current image URL:', imageUrl);
  console.log('Next image URL:', nextImageUrl);
  console.log('Is loading:', isLoading);

  return (
    <div className="card image-card">
      <h2>Celebration Image</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="Sobriety celebration" className="generated-image" />
      ) : (
        <div className="loading">Generating your first image...</div>
      )}
      {isLoading && <div className="loading-overlay">Preparing next image...</div>}
    </div>
  );
}

function App() {
  const [duration, setDuration] = useState('');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sobriety Celebration</h1>
      </header>
      <main className="app-main">
        <SobrietyTimer onDurationChange={setDuration} />
        <ImageGenerator duration={duration} />
      </main>
    </div>
  );
}

export default App;