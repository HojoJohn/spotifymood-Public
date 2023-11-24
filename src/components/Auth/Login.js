import React from 'react';

import './Login.css';



const LOGIN_ENDPOINT = '/.netlify/functions/spotify-auth?login';



const Login = () => {
  const handleLogin = async () => {
    // Redirect the user to the backend login endpoint
    // The backend should then redirect to the Spotify login page
    window.location.href = LOGIN_ENDPOINT;
  };

  return (
    <div className="login-container">
      <h1>Welcome to Spotify Mood-Based Playlist Generator</h1>
      <button onClick={handleLogin} className="login-button">
        Log in with Spotify
      </button>
    </div>
  );
};

export default Login;
