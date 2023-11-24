import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


const Header = ({ isAuthenticated, onLogout }) => {
  // Debug line to check the value of isAuthenticated
  console.log("Is Authenticated:", isAuthenticated);

  return (
    <header className="app-header">
      <h1 className="app-title">Spotify Mood-Based Playlist Generator</h1>
      <nav className="nav-bar">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/playlist">My Playlists</Link></li>
              <li><button onClick={onLogout}>Logout</button></li>
            </>
          )}
          {!isAuthenticated && (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
