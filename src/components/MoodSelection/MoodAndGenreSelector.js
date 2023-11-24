import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getStoredAccessToken } from '../../utils/authUtils';
import spotifyService from '../../services/spotifyService';
import './MoodAndGenreSelector.css';


const MoodAndGenreSelector = ({ onMoodSelect }) => {
  const [mood, setMood] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate(); // Create a navigate function

  useEffect(() => {
    const accessToken = getStoredAccessToken();
    if (accessToken) {
      spotifyService.getAvailableGenreSeeds(accessToken).then(setGenres);
    }
  }, []);

  const handleGenreChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedGenres(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mood && selectedGenres.length) {
      await onMoodSelect(mood, selectedGenres);
      navigate('/playlist'); // Navigate to the playlist page
    } else {
      alert('Please select a mood and at least one genre.');
    }
  };

  return (
    <div className="mood-and-genre-selector-container">
      <h2>Select Your Mood and Genres</h2>
      <form onSubmit={handleSubmit}>
        <div className="mood-options">
          {/* Your mood options */}
          <label><input type="radio" value="Happy" checked={mood === 'Happy'} onChange={(e) => setMood(e.target.value)} /> Happy</label>
          <label><input type="radio" value="Sad" checked={mood === 'Sad'} onChange={(e) => setMood(e.target.value)} /> Sad</label>
          <label><input type="radio" value="Energetic" checked={mood === 'Energetic'} onChange={(e) => setMood(e.target.value)} /> Energetic</label>
          <label><input type="radio" value="Chill" checked={mood === 'Chill'} onChange={(e) => setMood(e.target.value)} /> Chill</label>
          {/* Add more moods as needed */}
        </div>
        <div className="genre-options">
          <h3>Select Genres:</h3>
          <select multiple value={selectedGenres} onChange={handleGenreChange} className="genre-select">
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mood-genre-submit-btn">Generate Playlist</button>
      </form>
    </div>
  );
};

export default MoodAndGenreSelector;
