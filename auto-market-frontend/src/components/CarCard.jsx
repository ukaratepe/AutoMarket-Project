import { Link } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';

const CarCard = ({ araba }) => {
  const { toggleFavorite, isFavorite } = useFavorite();
  const added = isFavorite(araba.id);

  // KRİTİK DÜZELTME: Hem 'resim' hem 'resim_url' alanını kontrol et
  // Backend bazen 'resim', bazen 'resim_url' olarak gönderiyor.
  const resimKaynagi = araba.resim || araba.resim_url;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative flex flex-col h-full">
      
      {/* --- FAVORİ BUTONU --- */}
      <button 
        onClick={(e) => {
          e.preventDefault(); // Link'e tıklamayı engelle
          toggleFavorite(araba.id);
        }}
        className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={added ? "red" : "none"} 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke={added ? "red" : "currentColor"} 
          className="w-6 h-6 transition-colors duration-300"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      {/* --- RESİM ALANI --- */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={resimKaynagi} 
          alt={`${araba.marka} ${araba.model}`} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://dummyimage.com/600x400/cccccc/000000&text=Resim+Yok";
          }}
        />
      </div>
      
      {/* --- BİLGİ ALANI --- */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{araba.marka} {araba.model}</h3>
            <p className="text-sm text-gray-500">{araba.sehir} • {araba.yil}</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {araba.aciklama}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-xl font-bold text-blue-600">
            {Number(araba.fiyat).toLocaleString('tr-TR')} ₺
          </span>
          <Link 
            to={`/ilan/${araba.id}`} 
            className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition"
          >
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;