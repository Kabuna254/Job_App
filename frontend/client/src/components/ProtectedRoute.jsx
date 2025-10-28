import { Navigate } from 'react-router-dom';
import { authService } from '../api/authService';

const ProtectedRoute = ({ children, employerOnly = false }) => {
  const user = authService.getCurrentUser();

  const isLoggedIn = Boolean(user);
  const isVerifiedEmployer = isLoggedIn &&
    user.role === 'employer' &&
    user.isVerified === true;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (employerOnly && !isVerifiedEmployer) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
