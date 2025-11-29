import { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';
import api from '../api'; // <--- API dosyamızı çağırdık

const CarList = () => {
  const [cars, setCars] = useState([]); // Tüm arabalar
  const [filteredCars, setFilteredCars] = useState([]); // Filtrelenmiş hali
  const [loading, setLoading] = useState(true); // Yükleniyor durumu

  const [filters, setFilters] = useState({
    marka: '', sehir: '', minFiyat: '', maxFiyat: '', minYil: ''
  });

  // 1. Sayfa açılınca Veritabanından Çek
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars'); // GET /api/cars
        setCars(response.data);
        setFilteredCars(response.data); // Başlangıçta hepsi görünsün
        setLoading(false);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // 2. Filtreleme Mantığı (Backend'den gelen veri üzerinde)
  useEffect(() => {
    let result = cars;

    if (filters.marka) result = result.filter(car => car.marka === filters.marka);
    if (filters.sehir) result = result.filter(car => car.sehir === filters.sehir);
    if (filters.minFiyat) result = result.filter(car => parseFloat(car.fiyat) >= parseFloat(filters.minFiyat));
    if (filters.maxFiyat) result = result.filter(car => parseFloat(car.fiyat) <= parseFloat(filters.maxFiyat));
    if (filters.minYil) result = result.filter(car => car.yil >= parseInt(filters.minYil));

    setFilteredCars(result);
  }, [filters, cars]);

  const clearFilters = () => {
    setFilters({ marka: '', sehir: '', minFiyat: '', maxFiyat: '', minYil: '' });
  };

  if (loading) return <div className="text-center py-20 text-xl">Yükleniyor...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tüm İlanlar (Veritabanından)</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Filtre */}
        <div className="w-full md:w-1/4">
          <FilterSidebar filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
        </div>

        {/* Sağ Liste */}
        <div className="w-full md:w-3/4">
          <div className="mb-4 text-gray-600"><strong>{filteredCars.length}</strong> ilan bulundu.</div>
          
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map(araba => (
                <CarCard key={araba.id} araba={araba} />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 text-blue-800 p-6 rounded-lg text-center">
              Aradığınız kriterlere uygun araç bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarList;