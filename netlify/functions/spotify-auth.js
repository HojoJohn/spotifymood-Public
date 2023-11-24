const axios = require('axios');

exports.handler = async function(event, context) {
  // Log the received URL for debugging
  console.log('Received URL:', event.rawUrl);

  // Check if it's a login or token refresh request based on the query parameters
  const isLoginRequest = event.queryStringParameters.login !== undefined;
  const isTokenRefreshRequest = event.queryStringParameters['refresh-token'] !== undefined;

  if (isLoginRequest) {
    // Redirect to Spotify's authorization page
    const scopes = encodeURIComponent('streaming user-read-email user-read-private playlist-modify-private playlist-modify-public');
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&show_dialog=true`;
    return {
      statusCode: 302,
      headers: { Location: spotifyAuthUrl },
    };
  } else if (isTokenRefreshRequest) {
    // Refresh the access token
    const { refreshToken } = JSON.parse(event.body);
    try {
      const tokenResponse = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          accessToken: tokenResponse.data.access_token,
          expiresIn: tokenResponse.data.expires_in,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error during token refresh.' }),
      };
    }
  } else if (event.body) {
    // Handle the 'exchange-code' action
    const requestBody = JSON.parse(event.body);

    if (requestBody.action === 'exchange-code') {
      // Exchange the authorization code for an access token
      try {
        const tokenResponse = await axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: new URLSearchParams({
            grant_type: 'authorization_code',
            code: requestBody.code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
          }).toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return {
          statusCode: 200,
          body: JSON.stringify({
            accessToken: tokenResponse.data.access_token,
            expiresIn: tokenResponse.data.expires_in,
            refreshToken: tokenResponse.data.refresh_token,
          }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error during code exchange.' }),
        };
      }
    }
  }

  return {
    statusCode: 400,
    body: 'No valid action provided.',
  };
};
