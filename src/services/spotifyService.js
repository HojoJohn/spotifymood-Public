import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Update the endpoint to the Netlify Function path
    const response = await axios.post('/.netlify/functions/spotify-auth?refresh-token', { refreshToken });
    return response.data.accessToken; // Returns the new access token
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};
const exchangeCodeForAccessToken = async (code) => {
  try {
    const response = await axios.post('/.netlify/functions/spotify-auth', {
      action: 'exchange-code',
      code: code
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Function to fetch user's profile using the access token
const getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Function to fetch available genre seeds
const getAvailableGenreSeeds = async (accessToken) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/recommendations/available-genre-seeds`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching available genre seeds:', error);
    throw error;
  }
};

// Helper function to select a random subset of seeds
const selectRandomSeeds = (seedsArray, numberOfSeeds) => {
  const shuffled = [...seedsArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfSeeds);
};

// Function to get random recommendations based on mood and genres
const getRandomRecommendations = async (moodFeatures, selectedGenres, accessToken) => {
  const randomGenres = selectRandomSeeds(selectedGenres, 2);

  const params = new URLSearchParams({
    ...moodFeatures,
    seed_genres: randomGenres.join(',')
  }).toString();

  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/recommendations?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching random recommendations:', error);
    throw error;
  }
};

// Function to create a playlist
const createPlaylist = (userId, playlistName, accessToken) => {
  return axios.post(`${SPOTIFY_API_URL}/users/${userId}/playlists`, {
    name: playlistName,
    public: false
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
};

// Function to add tracks to a playlist
const addTracksToPlaylist = (playlistId, trackUris, accessToken) => {
  return axios.post(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
    uris: trackUris
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
};

const spotifyService = {
  exchangeCodeForAccessToken,
  refreshAccessToken,
  getUserProfile,
  getAvailableGenreSeeds,
  getRandomRecommendations,
  createPlaylist,
  addTracksToPlaylist
};

export default spotifyService;
