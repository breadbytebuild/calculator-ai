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

export default SobrietyTimer;