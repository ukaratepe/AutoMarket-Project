import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // API dosyamız

const AdminPanel = () => {
  const [adminCars, setAdminCars] = useState([]);
  const [stats, setStats] = useState({ cars: 0, orders: 0, users: 0 }); // İstatistikler
  const [loading, setLoading] = useState(true);

  // 1. Verileri Çekme Fonksiyonu
  const fetchData = async () => {
    try {
      // Arabaları çek
      const carsRes = await api.get('/cars');
      setAdminCars(carsRes.data);

      // İstatistikleri çek (Hata olursa sayfayı çökertmesin diye ayrı try-catch bloğu veya optional chaining kullanılabilir)
      try {
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (statError) {
        console.error("İstatistikler yüklenemedi:", statError);
      }

      setLoading(false);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
      setLoading(false);
    }
  };

  // Sayfa açılınca çalıştır
  useEffect(() => {
    fetchData();
  }, []);

  // 2. Silme Fonksiyonu
  const handleDelete = async (id) => {
    if (window.confirm("Bu ilanı veritabanından silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/cars/${id}`);
        // Listeyi güncelle (Silineni arayüzden çıkar)
        setAdminCars(adminCars.filter(car => car.id !== id));
        
        // İstatistikleri de güncelleyelim (Opsiyonel: -1 yapabiliriz)
        setStats(prev => ({ ...prev, cars: prev.cars - 1 }));
        
        alert("İlan silindi.");
      } catch (error) {
        alert("Silme işlemi başarısız oldu!");
        console.error(error);
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Yükleniyor...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- SOL MENÜ (SIDEBAR) --- */}
      <aside className="w-64 bg-gray-800 text-white hidden md:block flex-shrink-0">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="mt-6 space-y-2">
          
          <Link to="/admin" className="block py-3 px-6 bg-gray-700 border-l-4 border-blue-500 text-white">
            İlan Yönetimi
          </Link>
          
          <Link to="/admin/kullanicilar" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white transition">
            Kullanıcılar
          </Link>
          
          <Link to="/admin/yorumlar" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white transition">
            Yorumlar
          </Link>
          
          <Link to="/admin/siparisler" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white transition">
            Siparişler
          </Link>
          
          <Link to="/" className="block py-3 px-6 mt-10 hover:bg-red-600 text-gray-400 hover:text-white transition">
            ← Siteye Dön
          </Link>
        </nav>
      </aside>

      {/* --- ANA İÇERİK --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="text-gray-500 font-medium">Toplam Araç</div>
            <div className="text-3xl font-bold text-gray-800">{stats.cars}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="text-gray-500 font-medium">Toplam Sipariş</div>
            <div className="text-3xl font-bold text-gray-800">{stats.orders}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="text-gray-500 font-medium">Toplam Kullanıcı</div>
            <div className="text-3xl font-bold text-gray-800">{stats.users}</div>
          </div>
        </div>

        {/* BAŞLIK VE EKLE BUTONU */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Yayındaki İlanlar</h1>
          <Link to="/admin/yeni-arac" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow">
            + Yeni Araç Ekle
          </Link>
        </div>

        {/* ARAÇ LİSTESİ TABLOSU */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Araç Bilgisi
                </th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-5 py-3 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {adminCars.length > 0 ? (
                adminCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12">
                          <img 
                            className="w-full h-full rounded-md object-cover" 
                            src={car.resim} 
                            alt="" 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100?text=Resim+Yok"; }}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 font-bold whitespace-no-wrap">
                            {car.marka} {car.model}
                          </p>
                          <p className="text-gray-500 whitespace-no-wrap">{car.yil}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className="font-semibold text-gray-700">
                        {Number(car.fiyat).toLocaleString('tr-TR')} ₺
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <Link 
                        to={`/admin/duzenle/${car.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4 font-bold"
                      >
                        Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(car.id)}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-5 py-5 text-center text-gray-500">
                    Henüz veritabaninda kayitli araç yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;