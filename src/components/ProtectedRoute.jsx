import React from 'react';
import { getCookie } from '../utils/cookieUtils';
import LoginComponent from './LoginComponent';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(getCookie('auth_pin') === 'true');

  if (!isAuthenticated) {
    return <LoginComponent onSuccess={() => setIsAuthenticated(true)} />;
  }

  return children;
};

export default ProtectedRoute;
