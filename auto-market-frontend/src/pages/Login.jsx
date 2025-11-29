import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api'; // API dosyamız

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // BACKEND'E İSTEK AT
      const response = await api.post('/auth/login', { 
        email: email, 
        sifre: password 
      });

      // Başarılıysa gelen veriyi (id, name, role) Context'e kaydet
      login(response.data);
      
      alert(`Hoşgeldin ${response.data.name}!`);
      
      if (response.data.role === 'admin') navigate('/admin');
      else navigate('/');

    } catch (err) {
      // Hata varsa (401 vb.) mesajı göster
      setError(err.response?.data?.error || 'Giriş başarısız!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Giriş Yap</h2>

        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">E-Posta</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 border rounded" 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2 border rounded" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/kayit" className="text-blue-600 hover:underline font-bold">Hesap Oluştur</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;