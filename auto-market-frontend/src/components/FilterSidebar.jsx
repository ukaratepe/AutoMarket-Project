import { useState } from 'react';

const FilterSidebar = ({ filters, setFilters, clearFilters }) => {
  // Form elemanları değiştiğinde ana state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Filtrele</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Temizle
        </button>
      </div>

      <div className="space-y-6">
        {/* Marka Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
          <select 
            name="marka" 
            value={filters.marka}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümü</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Audi">Audi</option>
            <option value="Honda">Honda</option>
          </select>
        </div>

        {/* Şehir Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
          <select 
            name="sehir" 
            value={filters.sehir}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümü</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <option value="Bursa">Bursa</option>
          </select>
        </div>

        {/* Fiyat Aralığı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı (TL)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              name="minFiyat"
              value={filters.minFiyat}
              onChange={handleChange}
              placeholder="Min" 
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <input 
              type="number" 
              name="maxFiyat"
              value={filters.maxFiyat}
              onChange={handleChange}
              placeholder="Max" 
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
        </div>

        {/* Yıl Aralığı (Basitçe Min Yıl) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Yıl</label>
          <input 
            type="number" 
            name="minYil"
            value={filters.minYil}
            onChange={handleChange}
            placeholder="2015" 
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;