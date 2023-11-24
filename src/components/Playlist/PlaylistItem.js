import React from 'react';
import './PlaylistItem.css';


const PlaylistItem = ({ track }) => {
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${track.id}`;

  return (
    <div className="playlist-item">
      <iframe 
        src={spotifyEmbedUrl} 
        title={`Spotify: ${track.name} by ${track.artist}`}
        width="300" // Increase width as desired
        height="380" // Increase height as desired
        frameBorder="0" 
        allowtransparency="true" 
        allow="encrypted-media">
      </iframe>
    </div>
  );
};

export default PlaylistItem;