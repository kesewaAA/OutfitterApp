import React, { useState, useEffect } from 'react';
import './App.css';
import Settings from './pages/Settings'

function App() {
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (data.temperature) {
          setTemperature(data.temperature);
        }
      });
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1 className="app-name">Outfitter</h1>
        <div className="weather">
          <div className="weather-info">{temperature ? `${temperature}° F` : 'Loading...'}</div>
          <span className="weather-icon">☀️</span>
          <div className="weather-info">Sunny</div>
        </div>
      </header>

      <button className="suggestions-button">See Today's Suggestion</button>

      <div className="upcoming-events">
        <h2>Upcoming events</h2>
        <ul className="event-list">
          <li className="event-item">
            <span>11/14 Friday dinner at 6pm</span>
            <span className="edit-icon">✏️</span>
          </li>
        </ul>
        <button className="add-event-button">Add event</button>
      </div>

      <div className="recently-worn">
        <h2>Recently worn</h2>
        <div className="worn-items-grid">
          <div className="worn-item"></div>
          <div className="worn-item"></div>
          <div className="worn-item"></div>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>home</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👕</span>
          <span>closet</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>settings</span>
        </div>
      </nav>
    </div>
  );
}

export default App;