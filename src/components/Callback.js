import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import { storeAccessToken } from '../utils/authUtils';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange the code for an access token
      spotifyService.exchangeCodeForAccessToken(code)
        .then(data => {
          storeAccessToken(data.accessToken, data.expiresIn);
          // Navigate to mood selector or home page after successful login
          navigate('/mood-selector');
        })
        .catch(error => {
          console.error('Error during token exchange:', error);
          navigate('/'); // Redirect to home on error
        });
    } else {
      navigate('/'); // Redirect to home if no code is found
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
