require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({ origin: 'http://localhost:3001' })); // Adjust if your frontend is on a different port
app.use(bodyParser.json()); // To parse JSON bodies
app.use(express.static(path.join(__dirname, '..', 'build')));

// Updated endpoint to initiate the login process and redirect to Spotify's authorization page
app.get('/api/login', (req, res) => {
  const scopes = encodeURIComponent('streaming user-read-email user-read-private playlist-modify-private playlist-modify-public');
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&show_dialog=true`;
  res.redirect(spotifyAuthUrl);
});

// Endpoint to handle the callback from Spotify's OAuth flow
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    res.redirect(`http://localhost:3001/#access_token=${tokenResponse.data.access_token}&refresh_token=${tokenResponse.data.refresh_token}&expires_in=${tokenResponse.data.expires_in}`);
  } catch (error) {
    console.error('Error during token exchange:', error.response?.data || error.message);
    res.redirect(`http://localhost:3001/#error=access_denied`);
  }
});

// Endpoint to refresh the access token
app.post('/api/refresh_token', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    res.json({
      accessToken: tokenResponse.data.access_token,
      expiresIn: tokenResponse.data.expires_in,
    });
  } catch (error) {
    console.error('Error during token refresh:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error during token refresh.' });
  }
});

// Existing endpoint to exchange authorization code for an access token
app.post('/api/token', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    res.json({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    });
  } catch (error) {
    console.error('Error during token exchange:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error during token exchange.' });
  }
});

// Catch-all handler to serve the React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
