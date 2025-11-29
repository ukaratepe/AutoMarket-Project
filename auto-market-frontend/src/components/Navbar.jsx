import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Context'i çağır

const Navbar = () => {
  const { user, logout } = useAuth(); // Kullanıcı verisini ve çıkış fonksiyonunu al
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Çıkış yapınca ana sayfaya at
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AutoMarket
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Ana Sayfa</Link>
            <Link to="/ilanlar" className="text-gray-700 hover:text-blue-600 transition">İlanlar</Link>
            <Link to="/favoriler" className="text-gray-700 hover:text-blue-600 transition">Favoriler</Link>
            
            {/* Sadece Admin ise bu linki göster */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-red-600 font-semibold hover:text-red-800 transition">
                Admin Paneli
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
            <div className="flex items-center gap-4">
    {/* İsim ve Role Tıklayınca Profile Gitsin */}
    <Link to="/profil" className="text-right hidden sm:block hover:opacity-75 cursor-pointer">
      <div className="text-sm font-bold text-gray-800">{user.name}</div>
      <div className="text-xs text-gray-500 uppercase">{user.role}</div>
    </Link>
    
    <button 
      onClick={handleLogout}
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
    >
      Çıkış Yap
    </button>
            </div>
) : (
              // GİRİŞ YAPMAMIŞSA
              <>
                <Link to="/giris" className="text-gray-700 hover:text-blue-600 font-medium">
                  Giriş Yap
                </Link>
                <Link to="/kayit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;