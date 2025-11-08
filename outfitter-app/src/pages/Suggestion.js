import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Suggestion.css';
import Navigation from '../components/Navigation';
import hoodie from '../assets/clothing/hoodie.jpg';
import sweatpants from '../assets/clothing/sweatpants.webp';
import checkbox from '../assets/checkbox.svg';

const initialSuggestedItems = [
  {
    id: 2, // Matching the id from clothing.json
    label: 'Hoodie',
    src: hoodie,
    alt: 'hoodie'
  },
  {
    id: 5, // Matching the id from clothing.json
    label: 'Sweatpants',
    src: sweatpants,
    alt: 'sweatpants'
  }
];

function Suggestion() {
  const [temperature, setTemperature] = useState(null);
  const [suggestedItems, setSuggestedItems] = useState(initialSuggestedItems);
  const [isWorn, setIsWorn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setTemperature(data[0]);
      });
  }, []);

  const handleWearClick = () => {
    const item_ids = suggestedItems.map(item => item.id);

    fetch('/api/wear-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_ids }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.message);
      setIsWorn(true);
      setTimeout(() => {
        navigate('/closet');
      }, 300);
    })
    .catch(error => {
      console.error('Error updating worn items:', error);
    });
  };

  return (
    <div className="App">
      <h1 className="suggestion-header">Today's Suggestion</h1>
      <div className="divider"></div>
      <div className="based-on">Based on: Casual, {temperature ? `${temperature}° F` : 'Loading...'}</div>
      <div className="suggestion-grid">
        {suggestedItems.map(item => (
          <div key={item.id} className="suggestion-item">
            <img src={item.src} alt={item.alt} />
            <div className="suggestion-item-label">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="suggestion-buttons">
        <button 
          className={`suggestion-wear-button ${isWorn ? 'worn' : ''}`} 
          onClick={handleWearClick}
          disabled={isWorn}
        >
          {isWorn ? (
            <>
              <img src={checkbox} alt="checkbox" className="checkbox-icon" />
              Outfit Confirmed!
            </>
          ) : (
            'Wear'
          )}
        </button>
        <button className="suggestion-swap-button">Swap Item</button>
      </div>
      <Navigation />
    </div>
  );
}

export default Suggestion;
