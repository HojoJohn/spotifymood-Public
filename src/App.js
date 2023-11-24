import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './components/Home';
import Login from './components/Auth/Login';
import PlaylistDisplay from './components/Playlist/PlaylistDisplay';
import MoodAndGenreSelector from './components/MoodSelection/MoodAndGenreSelector';
import { storeAccessToken, getAccessTokenFromUrl, getStoredAccessToken, clearAccessToken } from './utils/authUtils';
import spotifyService from './services/spotifyService';
import PlaylistSavedConfirmation from './components/Pages/PlaylistSavedConfirmation';
import Callback from './components/Callback';
import './App.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Mood Playlist');

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
      storeAccessToken(accessToken);
      setIsAuthenticated(true);
      window.history.pushState("", document.title, "/mood-selector");
    } else {
      const storedAccessToken = getStoredAccessToken();
      setIsAuthenticated(!!storedAccessToken);
    }
  }, []);
 const handleLogout = () => {
    clearAccessToken(); // Clear the token from storage
    setIsAuthenticated(false); // Update authentication state
    window.history.pushState("", document.title, "/"); // Redirect to home
  };

  const handleMoodAndGenreSelect = async (mood, selectedGenres) => {
    const moodMapping = {
      Happy: { target_valence: 0.9, target_energy: 0.8 },
      Sad: { target_valence: 0.2, target_energy: 0.3 },
      Energetic: { target_valence: 0.7, target_energy: 0.9 },
      Chill: { target_valence: 0.4, target_energy: 0.4 },
    };

    const defaultMoodFeatures = { target_valence: 0.5, target_energy: 0.5 };
    const moodFeatures = moodMapping[mood] || defaultMoodFeatures;
    const accessToken = getStoredAccessToken();

    if (accessToken) {
      try {
        const recommendations = await spotifyService.getRandomRecommendations(moodFeatures, selectedGenres, accessToken);
        if (recommendations && recommendations.tracks) {
          setPlaylist(recommendations.tracks);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  };

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const createPlaylist = async (userId, accessToken) => {
    try {
      const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, { name: playlistName, public: false }, { headers: { Authorization: `Bearer ${accessToken}` } });
      return response.data.id;
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const addTracksToPlaylist = async (playlistId, trackUris, accessToken) => {
    try {
      await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris: trackUris }, { headers: { Authorization: `Bearer ${accessToken}` } });
    } catch (error) {
      console.error('Error adding tracks to playlist:', error);
    }
  };

  const onAddToSpotify = async (tracks) => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      console.log('Access token is missing. Please log in again.');
      return;
    }

    try {
      const userProfile = await spotifyService.getUserProfile(accessToken);
      if (!userProfile.id) {
        throw new Error('User ID is undefined');
      }

      const playlistId = await createPlaylist(userProfile.id, accessToken, playlistName);
      if (playlistId) {
        const trackUris = tracks.map(track => track.uri);
        await addTracksToPlaylist(playlistId, trackUris, accessToken);
      }
    } catch (error) {
      console.error('Error in adding tracks to Spotify:', error);
    }
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/playlist-saved" element={<PlaylistSavedConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={isAuthenticated ? (<>
          <input type="text" value={playlistName} onChange={handlePlaylistNameChange} placeholder="Enter Playlist Name" />
          <PlaylistDisplay playlist={playlist} onAddToSpotify={onAddToSpotify} />
        </>) : <Navigate to="/login" replace />} />
         <Route path="/mood-selector" element={isAuthenticated ? <MoodAndGenreSelector onMoodSelect={handleMoodAndGenreSelect} /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
