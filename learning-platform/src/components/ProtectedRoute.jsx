// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');

    // If no token, redirect to landing page
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If authenticated, show the protected page
    return children;
};

export default ProtectedRoute;
