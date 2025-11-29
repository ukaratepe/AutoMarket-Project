import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Kullanıcı bilgisini almamız lazım
import api from '../api';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]); // Sadece ID listesi tutacağız: [1, 5, 8]
  const { user } = useAuth(); // Giriş yapan kullanıcı kim?

  // 1. Kullanıcı değişince (Giriş yapınca) favorilerini çek
  useEffect(() => {
    if (user) {
      api.get(`/favorites/${user.id}`)
        .then(res => setFavorites(res.data))
        .catch(err => console.error("Favori hatası:", err));
    } else {
      setFavorites([]); // Çıkış yapınca temizle
    }
  }, [user]);

  // 2. Favori Ekle/Çıkar
  const toggleFavorite = async (carId) => {
    if (!user) {
      alert("Favorilere eklemek için giriş yapmalısınız!");
      return;
    }

    if (favorites.includes(carId)) {
      // Zaten favoride -> SİL (DELETE)
      try {
        await api.delete(`/favorites/${user.id}/${carId}`);
        setFavorites(favorites.filter(id => id !== carId));
      } catch (error) {
        console.error("Silinemedi", error);
      }
    } else {
      // Favoride değil -> EKLE (POST)
      try {
        await api.post('/favorites', { kullanici_id: user.id, araba_id: carId });
        setFavorites([...favorites, carId]);
      } catch (error) {
        console.error("Eklenemedi", error);
      }
    }
  };

  const isFavorite = (carId) => favorites.includes(carId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);