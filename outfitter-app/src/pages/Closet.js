import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import './Closet.css';
import camera from '../assets/camera.svg';

const clothingImages = {
  "./dress.jpg": require('../assets/clothing/dress.jpg'),
  "./hoodie.jpg": require('../assets/clothing/hoodie.jpg'),
  "./jacket.webp": require('../assets/clothing/jacket.webp'),
  "./jeans.jpg": require('../assets/clothing/jeans.jpg'),
  "./sweatpants.webp": require('../assets/clothing/sweatpants.webp'),
  "./tshirt.webp": require('../assets/clothing/tshirt.webp'),
};

const tagColors = [
  '#dba865',
  '#c9bf4d',
  '#9cc94d',
  '#71B87E',
  '#71b6b8',
  '#718fb8',
  '#7c71b8',
  '#9e71b8',
  '#b871ad',
  '#b87185'
];

const getColorForTag = (tag, index) => {
  return tagColors[index % tagColors.length];
};

function Closet() {
  const [clothingData, setClothingData] = useState([]);
  const [activeTags, setActiveTags] = useState([]);

  useEffect(() => {
    fetch('/api/clothing')
      .then(res => res.json())
      .then(data => setClothingData(data));
  }, []);

  const allTags = Array.from(new Set(clothingData.flatMap(item => item.tags)));
  const recentlyWornTag = "recently worn";
  const otherTags = allTags.filter(tag => tag !== recentlyWornTag);

  const handleTagClick = (tag) => {
    if (tag === recentlyWornTag) return;
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredClothing = activeTags.length > 0
    ? clothingData.filter(item => activeTags.every(tag => item.tags.includes(tag)))
    : clothingData;

  const displayedTags = [
    ...activeTags,
    ...otherTags.filter(tag => !activeTags.includes(tag))
  ];

  return (
    <div className="App">
      <h1 className="closet-header">My Outfitter Closet</h1>
      <div className="divider"></div>
      <div className="tags-container">
        <div
          className="tag"
          style={{ backgroundColor: '#FF8E8E', cursor: 'default' }}
        >
          {recentlyWornTag}
        </div>
        {displayedTags.map((tag, index) => (
          <div
            key={tag}
            className={`tag ${activeTags.includes(tag) ? 'active-tag' : ''}`}
            onClick={() => handleTagClick(tag)}
            style={{
              backgroundColor: activeTags.includes(tag)
                ? '#47A0DF'
                : getColorForTag(tag, index),
            }}
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="closet-content-scroll">
        <div className="closet-grid">
          {filteredClothing.map(item => (
            <div key={item.id} className={`closet-item ${item.tags.includes('recently worn') ? 'closet-worn-item' : ''}`}>
              <img src={clothingImages[item.src]} alt={item.alt} />
              <div className="closet-item-label">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="closet-buttons">
          <button className="closet-camera-button">
            <img src={camera} alt="camera" className="camera-icon" />
            Upload Clothes
          </button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default Closet;
