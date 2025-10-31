import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Spinner animation="border" />;
  }

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if route has specific role requirements
  if (roles && !roles.includes(user.role)) {
    // User is logged in but doesn't have the right role
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If all checks pass, render the child component
  return children;
};

export default PrivateRoute;