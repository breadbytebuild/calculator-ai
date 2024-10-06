import React, { useState } from 'react';
import './App.css';
import SobrietyTimer from './components/SobrietyTimer';
import ImageGenerator from './components/ImageGenerator';

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