import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistSavedConfirmation.css';


const PlaylistSavedConfirmation = () => {
  return (
    <div className="playlist-saved-confirmation">
      <h1>Your Playlist is Now on Spotify</h1>
      <p>Your playlist has been successfully saved to your Spotify account.</p>
      <Link to="/">Go Home</Link> {/* Link to navigate back to the home page */}
    </div>
  );
};

export default PlaylistSavedConfirmation;
