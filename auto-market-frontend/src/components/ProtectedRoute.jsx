import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  // 1. LocalStorage'dan kullanıcıyı oku
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Kullanıcı yoksa Giriş'e at
  if (!user) {
    return <Navigate to="/giris" replace />;
  }

  // 3. Admin yetkisi gerekiyorsa ve kullanıcı admin değilse Ana Sayfa'ya at
  if (roleRequired === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Her şey yolundaysa sayfayı göster
  return children;
};

export default ProtectedRoute;