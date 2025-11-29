import React, { useState, useEffect, useRef } from 'react';
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

const CLOTHING_CATEGORIES = [
  "t-shirt", "shirt", "dress", "pants", "jeans", "shorts",
  "skirt", "jacket", "coat", "hoodie", "sweater", "sweatpants",
  "blazer", "cardigan", "tank top", "blouse", "suit"
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
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [showClassification, setShowClassification] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectionMode = location.state?.selectionMode;
  const eventId = location.state?.eventId;
  const eventName = location.state?.eventName;
  const eventDate = location.state?.eventDate;
  const eventDescription = location.state?.eventDescription;
  const [selectedItems, setSelectedItems] = useState(location.state?.selectedClothing || []);

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchClothingData = () => {
    fetch(`${apiUrl}/api/clothing`)
      .then(res => res.json())
      .then(data => setClothingData(data));
  };

  useEffect(() => {
    fetchClothingData();
  }, []);

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (capturedImageUrl) {
        URL.revokeObjectURL(capturedImageUrl);
      }
    };
  }, [capturedImageUrl]);

  const allTags = Array.from(new Set(clothingData.flatMap(item => item.tags)));
  const recentlyWornTag = "recently worn";
  let filterableTags = allTags.filter(tag => tag !== 'saved');

  // Ensure 'recently worn' is at the front if it's present in the tags
  if (filterableTags.includes(recentlyWornTag)) {
      filterableTags = filterableTags.filter(tag => tag !== recentlyWornTag);
      filterableTags.unshift(recentlyWornTag); // Add to the beginning
  }

  const handleTagClick = (tag) => {
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
    fetch(`${apiUrl}/api/clothing/${itemId}/save`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        fetchClothingData();
        closePopup();
      });
  };

  const handleUnsave = (itemId) => {
    fetch(`${apiUrl}/api/clothing/${itemId}/unsave`, { method: 'POST' })
    .then(res => res.json())
    .then(() => {
      fetchClothingData();
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
    ...activeTags
  ];

  // Open camera
  const startCamera = async () => {
    try {
      setCameraReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to start playing
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play().then(() => {
            console.log('Video playing');
            // Camera is ready immediately after play starts
            setTimeout(() => {
              setCameraReady(true);
              console.log('Camera ready state set to true');
            }, 1000); // Just 1 second delay for safety
          }).catch(err => {
            console.error('Error playing video:', err);
            // Still enable camera even if autoplay fails
            setCameraReady(true);
          });
        };
      }

      setShowCamera(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions or use file upload.');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraReady(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    console.log('Capture photo called');
    console.log('Video element:', video);
    console.log('Video ready state:', video?.readyState);
    console.log('Video dimensions:', video?.videoWidth, 'x', video?.videoHeight);

    if (!video || !canvas) {
      console.error('Video or canvas ref not available');
      setError('Camera capture failed. Please try again.');
      return;
    }

    // Check if video has valid dimensions (more reliable than readyState)
    if (!video.videoWidth || !video.videoHeight) {
      console.error('Video has invalid dimensions');
      setError('Camera not ready. Please wait a moment and try again.');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    console.log('Canvas dimensions set to:', canvas.width, 'x', canvas.height);

    const context = canvas.getContext('2d');

    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Image drawn to canvas');

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob && blob.size > 0) {
          console.log('Image captured successfully', blob.size, 'bytes');
          const url = URL.createObjectURL(blob);
          setCapturedImage(blob);
          setCapturedImageUrl(url);
          stopCamera();
          setShowClassification(true);
        } else {
          console.error('Failed to create blob from canvas or blob is empty');
          setError('Failed to capture image. Please try again.');
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error('Error drawing to canvas:', err);
      setError('Failed to capture image. Please try again.');
    }
  };

  // Handle file input (alternative to camera)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(file);
      setCapturedImageUrl(url);
      setShowClassification(true);
    }
  };

  // Upload image with manual classification
  const uploadImage = async () => {
    if (!capturedImage || !selectedCategory) {
      setError('Please select a clothing category');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadStatus('Adding clothing item...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const newItem = {
          category: selectedCategory,
          image: base64Image
        };

        const response = await fetch(`${apiUrl}/api/clothing/manual-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newItem)
        });

        const data = await response.json();

        if (response.ok) {
          setUploadStatus(`✓ Added: ${selectedCategory}`);
          fetchClothingData();

          setTimeout(() => {
            // Clean up
            if (capturedImageUrl) {
              URL.revokeObjectURL(capturedImageUrl);
            }
            setCapturedImage(null);
            setCapturedImageUrl(null);
            setSelectedCategory('');
            setShowClassification(false);
            setUploadStatus(null);
            setUploading(false);
          }, 1500);
        } else {
          setError(data.error || 'Upload failed');
          setUploadStatus(null);
          setUploading(false);
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('Failed to read image file');
        setUploadStatus(null);
        setUploading(false);
      };

      reader.readAsDataURL(capturedImage);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
      setUploadStatus(null);
      setUploading(false);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl);
    }
    setCapturedImage(null);
    setCapturedImageUrl(null);
    setSelectedCategory('');
    setShowClassification(false);
    // Open file selector again
    fileInputRef.current.click();
  };

  // Cancel classification
  const cancelClassification = () => {
    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl);
    }
    setCapturedImage(null);
    setCapturedImageUrl(null);
    setSelectedCategory('');
    setShowClassification(false);
  };

  // Get image source for display
  const getImageSrc = (item) => {
    // For newly uploaded images stored as base64
    if (item.image && item.image.startsWith('data:')) {
      return item.image;
    }
    // For existing images, construct the public path
    const imageName = item.src.substring(item.src.lastIndexOf('/') + 1);
    return `/images/${imageName}`;
  };

  return (
    <div className={`closet-container ${selectionMode ? 'selection-mode' : ''}`}>
      <div className={`closet-overlay ${isPopupVisible ? 'active' : ''}`} onClick={closePopup}></div>

      {error && (
        <div className="error-banner">
          ⚠ {error}
        </div>
      )}

      {uploadStatus && (
        <div className="upload-status-banner">
          {uploadStatus}
        </div>
      )}

      {/* Classification View */}
      {showClassification && capturedImageUrl && (
        <div className="classification-container">
          <h2>Classify Your Clothing</h2>
          <img
            src={capturedImageUrl}
            alt="Captured clothing"
            className="preview-image"
          />

          <div className="category-selection">
            <label htmlFor="category-select">Select clothing type:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-dropdown"
            >
              <option value="">-- Choose a category --</option>
              {CLOTHING_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="classification-controls">
            <button
              className="classification-cancel-button"
              onClick={cancelClassification}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              className="classification-retake-button"
              onClick={retakePhoto}
              disabled={uploading}
            >
              Retake
            </button>
            <button
              className="classification-upload-button"
              onClick={uploadImage}
              disabled={uploading || !selectedCategory}
            >
              {uploading ? 'Adding...' : 'Add to Closet'}
            </button>
          </div>
        </div>
      )}

      {/* Normal Closet View */}
      {!showClassification && (
        <>
          <h1 className="closet-header">My Outfitter Closet</h1>
          <div className="closet-scrollable-content">
            <div className="divider"></div>

            {/* Tags */}
            <div className="tags-container">
              {filterableTags.map((tag, index) => (
                <div
                  key={tag}
                  className={`tag ${activeTags.includes(tag) ? 'active-tag' : ''} ${tag === recentlyWornTag ? 'recently-worn-tag-style' : ''}`}
                  onClick={() => handleTagClick(tag)}
                  style={{
                    backgroundColor: activeTags.includes(tag)
                      ? ''
                      : getColorForTag(tag, index),
                  }}
                >
                  {activeTags.includes(tag) && (
                    <span className="tag-x-button" onClick={(e) => {
                      e.stopPropagation();
                      handleTagClick(tag);
                    }}>
                      x
                    </span>
                  )}
                  {tag}
                </div>
              ))}
            </div>

            {/* Clothing Grid */}
            <div className="closet-grid">
              {filteredClothing.map(item => (
                <div
                  key={item.id}
                  className={`closet-item ${item.tags.includes('recently worn') ? 'closet-worn-item' : ''} ${selectedItems.some(selected => selected.id === item.id) ? 'selected-item' : ''}`}
                  onClick={(e) => handleItemClick(e, item)}
                >
                  {item.tags.includes('saved') && <img src={star} alt="saved" className="saved-star" />}
                  <img src={getImageSrc(item)} alt={item.alt} />
                  <div className="closet-item-label">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="closet-buttons">
              {selectionMode ? (
                <button className="confirm-button" onClick={handleConfirm}>
                  Confirm
                </button>
              ) : (
                <>
                  <button
                    className="closet-camera-button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <img src={camera} alt="camera" className="camera-icon" />
                    Upload Clothes
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Item Popup */}
      {isPopupVisible && selectedItemPopup && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageSrc(selectedItemPopup)} alt={selectedItemPopup.alt} className="popup-img" />
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