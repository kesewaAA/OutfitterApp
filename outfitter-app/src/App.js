import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Suggestion from './pages/Suggestion';
import Closet from './pages/Closet';
import Settings from './pages/Settings';
import AddEvent from './pages/AddEvent';
import LoadingScreen from './components/LoadingScreen'; // Import the LoadingScreen component

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      setTemperature(data[0]);
      setWeather(data[1].split(' ')[0]);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      return false; // Indicate failure
    }
  };

  useEffect(() => {
    let fadeOutTimer;
    let loadingTimer;
    let weatherInterval;

    const initializeApp = async () => {
      const weatherPromise = fetchWeather();
      const minimumDisplayTimePromise = new Promise(resolve => setTimeout(resolve, 3000));

      await Promise.all([weatherPromise, minimumDisplayTimePromise]);

      setIsFading(true); // Start fading out the loading screen
      fadeOutTimer = setTimeout(() => {
        setIsLoading(false); // Remove the loading screen from the DOM
      }, 500); // Duration of fade-out transition

      // Set up periodic weather fetching if enabled
      const weatherChangesSaved = localStorage.getItem('weatherChanges');
      const weatherChanges = weatherChangesSaved !== null ? JSON.parse(weatherChangesSaved) : true;

      if (weatherChanges) {
        weatherInterval = setInterval(() => {
          fetchWeather();
        }, 300000); // 5 minutes
      }
    };

    initializeApp();

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(loadingTimer);
      clearInterval(weatherInterval);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen className={isFading ? 'fade-out' : ''} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home temperature={temperature} weather={weather} />} />
        <Route path="/suggestion" element={<Suggestion />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/add-event/:eventId" element={<AddEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
