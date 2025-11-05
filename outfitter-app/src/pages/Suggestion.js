import React, { useState, useEffect } from 'react';
import '../App.css';
import './Suggestion.css';
import Navigation from '../components/Navigation';
import hoodie from '../assets/hoodie.jpg';
import sweatpants from '../assets/sweatpants.webp';

function Suggestion() {
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setTemperature(data[0]);
      });
  }, []);

  return (
    <div className="App">
      <h1 className="suggestion-header">Today's Suggestion</h1>
      <div className="divider"></div>
      <div className="based-on">Based on: Casual, {temperature ? `${temperature}° F` : 'Loading...'}</div>
      <div className="suggestion-grid">
        <div className="suggestion-item">
          <img src={hoodie} alt="hoodie" />
        </div>
        <div className="suggestion-item">
          <img src={sweatpants} alt="sweatpants" />
        </div>
      </div>
      <div className="suggestion-buttons">
        <button className="suggestion-wear-button">Wear</button>
        <button className="suggestion-swap-button">Swap Item</button>
      </div>
      <Navigation />
    </div>
  );
}

export default Suggestion;
