import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    // Check if the user has the required role, if specified
    if (requiredRole) {
      try {
        const user = JSON.parse(userData);
        setHasRequiredRole(user.role === requiredRole);
      } catch (e) {
        setHasRequiredRole(false);
      }
    }
    
    setIsAuthenticated(true);
    setLoading(false);
  }, [requiredRole]);

  if (loading) {
    // You could return a loading spinner or component here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 