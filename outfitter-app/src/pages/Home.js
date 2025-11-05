import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import sunny from '../assets/sunny.svg';
import cloudy from '../assets/cloudy.svg';
import rainy from '../assets/rainy.svg';
import snowy from '../assets/snowy.svg';
import edit from '../assets/edit.svg';
import Navigation from '../components/Navigation';

function Home() {
  const [temperature, setTemperature] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setTemperature(data[0]);
        setWeather(data[1].split(' ')[0]);
      });
  }, []);

  const getWeatherIcon = (weather) => {
    if (!weather) return sunny;
    const lowerCaseWeather = weather.toLowerCase();
    if (lowerCaseWeather.includes('sunny')) return sunny;
    if (lowerCaseWeather.includes('cloudy')) return cloudy;
    if (lowerCaseWeather.includes('rainy')) return rainy;
    if (lowerCaseWeather.includes('snowy')) return snowy;
    return sunny;
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="app-name">Outfitter</h1>
        <div className="weather">
          <div className="weather-info">{temperature ? `${temperature}° F` : 'Loading...'}</div>
          <img src={getWeatherIcon(weather)} className="weather-icon" alt="weather icon" />
          <div className="weather-info">{weather ? weather : 'Loading...'}</div>
        </div>
      </header>

      <Link to="/suggestion" className="suggestions-button">See Today's Suggestion</Link>

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

      <Navigation />
    </div>
  );
}

export default Home;
