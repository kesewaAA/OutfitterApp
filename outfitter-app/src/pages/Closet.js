import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import './Closet.css';

const clothingImages = {
  "./dress.jpg": require('../assets/clothing/dress.jpg'),
  "./hoodie.jpg": require('../assets/clothing/hoodie.jpg'),
  "./jacket.webp": require('../assets/clothing/jacket.webp'),
  "./jeans.jpg": require('../assets/clothing/jeans.jpg'),
  "./sweatpants.webp": require('../assets/clothing/sweatpants.webp'),
  "./tshirt.webp": require('../assets/clothing/tshirt.webp'),
};

function Closet() {
  const [clothingData, setClothingData] = useState([]);

  useEffect(() => {
    fetch('/api/clothing')
      .then(res => res.json())
      .then(data => setClothingData(data));
  }, []);

  return (
    <div className="App">
      <h1 className="closet-header">My Outfitter Closet</h1>
      <div className="divider"></div>
      <div className="closet-grid">
        {clothingData.map(item => (
          <div key={item.id} className={`closet-item ${item.tags.includes('recently worn') ? 'closet-worn-item' : ''}`}>
            <img src={clothingImages[item.src]} alt={item.alt} />
            <div className="closet-item-label">{item.label}</div>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );
}

export default Closet;
