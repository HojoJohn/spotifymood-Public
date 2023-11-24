import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const goToMoodSelector = () => {
    navigate('/mood-selector'); // Navigate to mood selector
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Spotify Mood-Based Playlist Generator</h1>
      <p>Get playlists that fit your mood and discover new music.</p>
      <button onClick={goToMoodSelector} className="start-button">
        Get Started
      </button>
    </div>
  );
};

export default Home;
