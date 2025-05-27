import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const userId = localStorage.getItem('userId');

  if (!user && !userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
