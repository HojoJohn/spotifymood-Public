import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PlaylistItem from './PlaylistItem'; 
import './PlaylistDisplay.css';

const PlaylistDisplay = ({ playlist, onAddToSpotify }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  if (!playlist || playlist.length === 0) {
    return <div className="playlist-display">No playlist found. Try selecting a mood first.</div>;
  }

    const handleSaveToSpotify = () => {
    onAddToSpotify(playlist);
    navigate('/playlist-saved'); // Navigate to the confirmation page
  }

  return (
    <div className="playlist-display">
      <h2>Your Generated Playlist</h2>
      <div className="playlist">
        {playlist.map((track, index) => (
          <PlaylistItem key={index} track={track} />
        ))}
      </div>
      <button onClick={handleSaveToSpotify}>Save to Spotify</button>
    </div>
  );
};

export default PlaylistDisplay;
