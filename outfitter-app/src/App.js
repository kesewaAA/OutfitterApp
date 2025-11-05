import React, { useState, useEffect } from 'react';
import './App.css';
import sunny from './assets/sunny.svg';
import edit from './assets/edit.svg';
import home from './assets/home.svg';
import closet from './assets/closet.svg';
import settings from './assets/settings.svg';

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
          <img src={sunny} className="weather-icon" alt="weather icon" />
          <div className="weather-info">Sunny</div>
        </div>
      </header>

      <button className="suggestions-button">See Today's Suggestion</button>

      <div className="upcoming-events">
        <h2>Upcoming events</h2>
        <ul className="event-list">
          <li className="event-item">
            <span>11/14 Friday dinner at 6pm</span>
            <img src={edit} className="edit-icon" alt="edit icon" />
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
          <img src={home} className="nav-icon" alt="home icon" />
          <span>Home</span>
        </div>
        <div className="nav-item">
          <img src={closet} className="nav-icon" alt="closet icon" />
          <span>Closet</span>
        </div>
        <div className="nav-item">
          <img src={settings} className="nav-icon" alt="settings icon" />
          <span>Settings</span>
        </div>
      </nav>
    </div>
  );
}

export default App;