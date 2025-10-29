import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configure axios to automatically include security token in all API requests
axios.interceptors.request.use(
  (config) => {
    // Get security token from sessionStorage
    const securityToken = sessionStorage.getItem('security_token');
    
    // Add token to request headers if it exists
    if (securityToken && config.url && config.url.startsWith('/api')) {
      config.headers['X-Security-Token'] = securityToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses - token expired or invalid
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.requiresKey) {
      // Clear invalid token
      sessionStorage.removeItem('security_token');
      sessionStorage.removeItem('security_verified');
      
      // If we're not already on the landing page, show the modal again
      // This will be handled by the LandingPage component
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
