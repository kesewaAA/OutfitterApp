import React from 'react';
import { Link } from 'react-router-dom';
import home from '../assets/home.svg';
import closet from '../assets/closet.svg';
import settings from '../assets/settings.svg';
import '../App.css';

function Navigation() {
  return (
    <nav className="nav-menu">
      <Link to="/" className="nav-item">
        <img src={home} className="nav-icon" alt="home icon" />
        <span>Home</span>
      </Link>
      <div className="nav-item">
        <img src={closet} className="nav-icon" alt="closet icon" />
        <span>Closet</span>
      </div>
      <div className="nav-item">
        <img src={settings} className="nav-icon" alt="settings icon" />
        <span>Settings</span>
      </div>
    </nav>
  );
}

export default Navigation;
