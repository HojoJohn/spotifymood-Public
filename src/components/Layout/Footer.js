
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>© {currentYear} Spotify Mood-Based Playlist Generator</span>
        <div className="footer-links">
          <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">Powered by Spotify</a>
          {/* Additional links or social media icons can be added here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
