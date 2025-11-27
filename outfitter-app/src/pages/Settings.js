import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [dailySuggestions, setDailySuggestions] = useState(true);
  const [weatherChanges, setWeatherChanges] = useState(true);
  const [plannedEvents, setPlannedEvents] = useState(true);

  useEffect(() => {
    const dailySuggestionsSaved = localStorage.getItem('dailySuggestions');
    if (dailySuggestionsSaved !== null) {
      setDailySuggestions(JSON.parse(dailySuggestionsSaved));
    } else {
      localStorage.setItem('dailySuggestions', JSON.stringify(true));
    }

    const weatherChangesSaved = localStorage.getItem('weatherChanges');
    if (weatherChangesSaved !== null) {
      setWeatherChanges(JSON.parse(weatherChangesSaved));
    } else {
      localStorage.setItem('weatherChanges', JSON.stringify(true));
    }

    const plannedEventsSaved = localStorage.getItem('plannedEvents');
    if (plannedEventsSaved !== null) {
      setPlannedEvents(JSON.parse(plannedEventsSaved));
    } else {
      localStorage.setItem('plannedEvents', JSON.stringify(true));
    }
  }, []);

  const handleDailySuggestionsChange = () => {
    const newValue = !dailySuggestions;
    setDailySuggestions(newValue);
    localStorage.setItem('dailySuggestions', JSON.stringify(newValue));
  };

  const handleWeatherChangesChange = () => {
    const newValue = !weatherChanges;
    setWeatherChanges(newValue);
    localStorage.setItem('weatherChanges', JSON.stringify(newValue));
  };

  const handlePlannedEventsChange = () => {
    const newValue = !plannedEvents;
    setPlannedEvents(newValue);
    localStorage.setItem('plannedEvents', JSON.stringify(newValue));
  };

  return (
    <div className="App">
      <h1 className="settings-header">Settings</h1>
      
      <div className="settings-section">
        <h2 className="settings-subheader">Account</h2>
        <div className="settings-box-container">
          <div className="settings-box clickable">
            <span>Profile Information</span>
          </div>
          <div className="settings-box clickable">
            <span>Log Out</span>
          </div>
        </div>
      </div>

     <div className="settings-box clickable" onClick={() => navigate("/auth")}>
            <span>Log In / Sign Up</span>
          </div>
  </div> #added 

      <div className="settings-section">
        <h2 className="settings-subheader">Weather</h2>
        <div className="settings-toggles-container">
          <div className="settings-toggle">
            <span>Daily Suggestions</span>
            <label className="switch">
              <input type="checkbox" checked={dailySuggestions} onChange={handleDailySuggestionsChange} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="settings-toggle">
            <span>Weather Changes</span>
            <label className="switch">
              <input type="checkbox" checked={weatherChanges} onChange={handleWeatherChangesChange} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="settings-toggle">
            <span>Planned events</span>
            <label className="switch">
              <input type="checkbox" checked={plannedEvents} onChange={handlePlannedEventsChange} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}

export default Settings;
