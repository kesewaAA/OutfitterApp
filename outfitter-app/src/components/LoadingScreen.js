import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ className }) {
  return (
    <div className={`loading-screen ${className}`}>
      <h1 className="loading-text">Outfitter</h1>
    </div>
  );
}

export default LoadingScreen;
