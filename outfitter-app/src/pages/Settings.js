import React from 'react';
import Navigation from '../components/Navigation';
import './Settings.css';

function Settings() {
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

      <div className="settings-section">
        <h2 className="settings-subheader">Weather</h2>
        <div className="settings-toggles-container">
          <div className="settings-toggle">
            <span>Daily Suggestions</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="settings-toggle">
            <span>Weather Changes</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="settings-toggle">
            <span>Planned events</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="settings-toggle">
            <span>Laundry Reminder</span>
            <label className="switch">
              <input type="checkbox" />
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
