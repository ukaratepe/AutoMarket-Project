import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ad: '', soyad: '', email: '', sifre: '', sifreTekrar: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.sifre !== formData.sifreTekrar) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    try {
      // BACKEND'E KAYIT İSTEĞİ
      await api.post('/auth/register', {
        ad: formData.ad,
        soyad: formData.soyad,
        email: formData.email,
        sifre: formData.sifre
      });

      alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
      navigate('/giris');
      
    } catch (error) {
      alert(error.response?.data?.error || "Kayıt sırasında hata oluştu.");
    }
  };

  return (
    // ... (Tasarım kısmı aynı kalacak, sadece input'ların name attribute'larına dikkat et)
    // Eğer önceki kodun duruyorsa return kısmını değiştirmene gerek yok.
    // Sadece handleSubmit fonksiyonunu yukarıdaki gibi güncellemen yeterli.
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      {/* ... Form Tasarımı ... (Burayı koru) */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Kayıt Ol</h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input name="ad" type="text" placeholder="Ad" required onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
              <input name="soyad" type="text" placeholder="Soyad" required onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
              <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
              <input name="sifre" type="password" placeholder="Şifre" required onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
              <input name="sifreTekrar" type="password" placeholder="Şifre Tekrar" required onChange={handleChange} className="w-full border p-2 mb-4 rounded" />
              
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Kayıt Ol</button>
          </form>
      </div>
    </div>
  );
};

export default Register;