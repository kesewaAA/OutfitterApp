import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Suggestion from './pages/Suggestion';
import Closet from './pages/Closet';
import Settings from './pages/Settings';
import AddEvent from './pages/AddEvent';
import LoadingScreen from './components/LoadingScreen';
import Auth from "./pages/Auth";  
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [weather, setWeather] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchWeather = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/weather`);
      const data = await res.json();
      
      if (res.ok && Array.isArray(data) && data.length >= 2) {
        setTemperature(data[0]);
        setWeather(data[1].split(' ')[0]);
      } else {
        console.error("Failed to fetch weather, received:", data);
      }
      return true;
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      return false;
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

      setIsFading(true);
      fadeOutTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      const weatherChangesSaved = localStorage.getItem('weatherChanges');
      const weatherChanges = weatherChangesSaved !== null ? JSON.parse(weatherChangesSaved) : true;

      if (weatherChanges) {
        weatherInterval = setInterval(() => {
          fetchWeather();
        }, 300000);
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
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home temperature={temperature} weather={weather} />} />
          <Route path="/suggestion" element={<Suggestion />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/add-event/:eventId" element={<AddEvent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
