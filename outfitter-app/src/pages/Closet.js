import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Closet.css';
import camera from '../assets/camera.svg';
import star from '../assets/star.svg';

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
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedItemPopup, setSelectedItemPopup] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const selectionMode = location.state?.selectionMode;
  const eventId = location.state?.eventId;
  const eventName = location.state?.eventName;
  const eventDate = location.state?.eventDate;
  const eventDescription = location.state?.eventDescription;
  const [selectedItems, setSelectedItems] = useState(location.state?.selectedClothing || []);

  const fetchClothingData = () => {
    fetch('/api/clothing')
      .then(res => res.json())
      .then(data => setClothingData(data));
  };

  useEffect(() => {
    fetchClothingData();
  }, []);

  const allTags = Array.from(new Set(clothingData.flatMap(item => item.tags)));
  const recentlyWornTag = "recently worn";
  const otherTags = allTags.filter(tag => tag !== recentlyWornTag && tag !== 'saved');

  const handleTagClick = (tag) => {
    if (tag === recentlyWornTag) return;
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleItemClick = (e, item) => {
    if (e.target.classList.contains('saved-star')) {
      handleUnsave(item.id);
      return;
    }
    if (selectionMode) {
      setSelectedItems(prev =>
        prev.some(selected => selected.id === item.id)
          ? prev.filter(selected => selected.id !== item.id)
          : [...prev, item]
      );
    } else {
      setSelectedItemPopup(item);
      setIsPopupVisible(true);
    }
  };

  const handleSaveForLater = (itemId) => {
    fetch(`/api/clothing/${itemId}/save`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        fetchClothingData(); // Refetch data to get the updated list
        closePopup();
      });
  };

  const handleUnsave = (itemId) => {
    fetch(`/api/clothing/${itemId}/unsave`, { method: 'POST' })
    .then(res => res.json())
    .then(() => {
      fetchClothingData(); // Refetch data to get the updated list
    });
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedItemPopup(null);
  };

  const handleConfirm = () => {
    navigate(eventId ? `/add-event/${eventId}` : '/add-event', { 
      state: { 
        selectedClothing: selectedItems, 
        fromCloset: true,
        eventName: eventName,
        eventDate: eventDate,
        eventDescription: eventDescription
      } 
    });
  };

  const filteredClothing = activeTags.length > 0
    ? clothingData.filter(item => activeTags.every(tag => item.tags.includes(tag)))
    : clothingData;

  const displayedTags = [
    ...activeTags,
    ...otherTags.filter(tag => !activeTags.includes(tag))
  ];

  return (
    <div className={`closet-container ${selectionMode ? 'selection-mode' : ''}`}>
      <div className={`closet-overlay ${isPopupVisible ? 'active' : ''}`} onClick={closePopup}></div>
      <h1 className="closet-header">My Outfitter Closet</h1>
      <div className="closet-scrollable-content">
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
                  ? '' // Handled by CSS
                  : getColorForTag(tag, index),
              }}
            >
              {activeTags.includes(tag) && (
                <span className="tag-x-button" onClick={(e) => {
                  e.stopPropagation(); // Prevent click from propagating to the parent tag div
                  handleTagClick(tag);
                }}>
                  x
                </span>
              )}
              {tag}
            </div>
          ))}
        </div>
        <div className="closet-grid">
          {filteredClothing.map(item => (
            <div
              key={item.id}
              className={`closet-item ${item.tags.includes('recently worn') ? 'closet-worn-item' : ''} ${selectedItems.some(selected => selected.id === item.id) ? 'selected-item' : ''}`}
              onClick={(e) => handleItemClick(e, item)}
            >
              {item.tags.includes('saved') && <img src={star} alt="saved" className="saved-star" />}
              <img src={require(`../assets/clothing/${item.src.substring(2)}`)} alt={item.alt} />
              <div className="closet-item-label">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="closet-buttons">
          {selectionMode ? (
            <button className="confirm-button" onClick={handleConfirm}>
              Confirm
            </button>
          ) : (
            <button className="closet-camera-button">
              <img src={camera} alt="camera" className="camera-icon" />
              Upload Clothes
            </button>
          )}
        </div>
      </div>
      {isPopupVisible && selectedItemPopup && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={require(`../assets/clothing/${selectedItemPopup.src.substring(2)}`)} alt={selectedItemPopup.alt} className="popup-img" />
            <button className="save-for-later-button" onClick={() => handleSaveForLater(selectedItemPopup.id)}>
              Save for Later
            </button>
          </div>
        </div>
      )}
      <Navigation />
    </div>
  );
}

export default Closet;
