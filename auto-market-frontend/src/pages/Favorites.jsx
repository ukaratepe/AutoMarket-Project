import { useState, useEffect } from 'react';
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import api from '../api';

const Favorites = () => {
  const { favorites } = useFavorite(); // Favori ID listesi (Örn: [1, 3])
  const { user } = useAuth();
  
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteCars = async () => {
      // Eğer favori listesi boşsa işlem yapma
      if (favorites.length === 0) {
        setFavoriteCars([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Tüm favori ID'leri için tek tek detay isteği at (Promise.all ile paralel)
        // Not: Gerçek hayatta backend'de "getMany" endpoint'i olması daha iyidir ama bu yöntem de çalışır.
        const requests = favorites.map(id => api.get(`/cars/${id}`));
        const responses = await Promise.all(requests);
        
        // Gelen yanıtların içindeki verileri (data) alıp listeye koy
        const carsData = responses.map(res => res.data);
        setFavoriteCars(carsData);
        
      } catch (error) {
        console.error("Favori araçlar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavoriteCars();
    } else {
      setLoading(false); // Kullanıcı yoksa yükleme bitti
    }
  }, [favorites, user]); // favorites listesi değişince (kalbe basınca) tekrar çalışır

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Favorilerinizi Görmek İçin Giriş Yapın</h2>
        <Link to="/giris" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20 text-xl">Favoriler yükleniyor...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Favorilerim ({favoriteCars.length})</h1>

      {favoriteCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCars.map(araba => (
            <CarCard key={araba.id} araba={araba} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Listeniz Boş</h2>
          <p className="text-gray-500 mb-6">Henüz hiçbir aracı favoriye eklemediniz.</p>
          <Link to="/ilanlar" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            İlanlara Göz At
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;