// src/utils/authUtils.js
// Additional Import

 // This function will be defined in spotifyPlayerService.js

/**
 * Parses the hash from the redirected URL and extracts the access token if it exists.
 */
export const getAccessTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {}).access_token;
};

/**
 * Stores the access token in local storage.
 */
export const storeAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

/**
 * Retrieves the access token from local storage.
 */
export const getStoredAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Clears the access token from local storage, effectively logging out the user.
 */
export const clearAccessToken = () => {
  localStorage.removeItem('accessToken');
};

/**
 * Checks if the user is currently authenticated by verifying the presence of an access token.
 */
export const isAuthenticated = () => {
  const accessToken = getStoredAccessToken();
  return !!accessToken; // Convert to boolean: true if accessToken exists, false otherwise.
};
