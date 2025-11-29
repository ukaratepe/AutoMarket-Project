import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import api from '../api'; // API dosyamızı çağırdık

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        // Tüm arabaları çek
        const response = await api.get('/cars');
        
        // Backend zaten tarihe göre (en yeni en üstte) sıralı gönderiyor.
        // Biz sadece ilk 3 tanesini alıp "Öne Çıkan" yapacağız.
        setFeaturedCars(response.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Öne çıkanlar yüklenemedi:", error);
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  return (
    <div>
      {/* Hero Section (Karşılama Alanı) */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hayalindeki Arabayı Bul
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Güvenilir satıcılar, uygun fiyatlar ve geniş model seçenekleri AutoMarket'te.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/ilanlar" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              İlanları İncele
            </Link>
            <Link to="/kayit" className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition">
              Aramıza Katıl
            </Link>
          </div>
        </div>
      </div>

      {/* Öne Çıkan Araçlar Listesi */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Öne Çıkan Fırsatlar</h2>
            <p className="text-gray-600 mt-2">En son eklenen ve en çok ilgi gören araçlar.</p>
          </div>
          <Link to="/ilanlar" className="text-blue-600 font-semibold hover:underline hidden md:block">
            Tümünü Gör →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">İlanlar yükleniyor...</div>
        ) : (
          <>
            {featuredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map(araba => (
                  <CarCard key={araba.id} araba={araba} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded text-gray-500">
                Henüz vitrine eklenecek araç yok.
              </div>
            )}
          </>
        )}
        
        <div className="mt-8 text-center md:hidden">
           <Link to="/ilanlar" className="text-blue-600 font-bold hover:underline">
            Tüm İlanları Gör →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;