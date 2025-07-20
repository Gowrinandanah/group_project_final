import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Wrap protected components with this component to enforce authentication.
 */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // If no token, redirect to login and preserve intended route
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
