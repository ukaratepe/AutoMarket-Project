import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Bu satırı kontrol et
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Favorites from './pages/Favorites';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar'; 
import AdminOrders from './pages/AdminOrders'; 
import AdminUsers from './pages/AdminUsers'; // <--- EKLE
import AdminComments from './pages/AdminComments'; // <--- EKLE
import Profile from './pages/Profile'; // <--- EKLE

// Context Sağlayıcıları
import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext';

function App() {
  return (
    <Router>
      {/* Context'ler ile uygulamayı sarmalıyoruz */}
      <AuthProvider>
        <FavoriteProvider>
          
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ilanlar" element={<CarList />} />
              <Route path="/ilan/:id" element={<CarDetail />} />
              <Route path="/favoriler" element={<Favorites />} />
              <Route path="/giris" element={<Login />} />
              <Route path="/kayit" element={<Register />} /> {/* <--- Bu rota eksik olabilir */}
              <Route path="/profil" element={<Profile />} /> {/* <--- PROFİL ROTASI */}
              
              {/* Admin Paneli Koruması */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute roleRequired="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              {/* ==> YENİ EKLENEN KISIM: Admin'e özel araç ekleme sayfası <== */}
              <Route 
                path="/admin/yeni-arac" 
                element={
                  <ProtectedRoute roleRequired="admin">
                    <AddCar />
                  </ProtectedRoute>
                } 
              />
              {/* ==> YENİ EKLENENLER <== */}
              <Route path="/admin/duzenle/:id" element={<ProtectedRoute roleRequired="admin"><EditCar /></ProtectedRoute>} />
              <Route path="/admin/siparisler" element={<ProtectedRoute roleRequired="admin"><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/kullanicilar" element={<ProtectedRoute roleRequired="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/yorumlar" element={<ProtectedRoute roleRequired="admin"><AdminComments /></ProtectedRoute>} />  
            </Routes>
            
          </div>

        </FavoriteProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;