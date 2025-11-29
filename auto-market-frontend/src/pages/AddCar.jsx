import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext'; // <--- 1. EKLEME

const AddCar = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // <--- 2. EKLEME: Giriş yapan kullanıcıyı al
  
  const [formData, setFormData] = useState({
    // kullanici_id'yi buradan sildik, aşağıda dinamik ekleyeceğiz
    model_id: '',
    sehir_id: '',
    fiyat: '',
    yil: '',
    aciklama: '',
    resim_url: ''
  });

  const [extraPhotos, setExtraPhotos] = useState([""]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (index, value) => {
    const updatedPhotos = [...extraPhotos];
    updatedPhotos[index] = value;
    setExtraPhotos(updatedPhotos);
  };

  const addPhotoField = () => {
    setExtraPhotos([...extraPhotos, ""]);
  };

  const removePhotoField = (index) => {
    const updatedPhotos = extraPhotos.filter((_, i) => i !== index);
    setExtraPhotos(updatedPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Güvenlik Kontrolü: Kullanıcı giriş yapmamışsa uyar
    if (!user) {
      alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      navigate('/giris');
      return;
    }

    try {
      const payload = {
        ...formData,
        kullanici_id: user.id, // <--- 3. EKLEME: Gerçek ID'yi buraya koyduk
        fotolar: extraPhotos
      };

      await api.post('/cars', payload);
      
      alert("Araç ve fotoğraflar başarıyla kaydedildi!");
      navigate('/admin');
    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Hata oluştu! Alanları kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="bg-gray-800 text-white p-6 flex justify-between">
          <h2 className="text-2xl font-bold">Yeni Araç Ekle</h2>
          <Link to="/admin" className="text-gray-300 hover:text-white">İptal</Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* --- FORM ALANLARI AYNI KALACAK --- */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">Model Seçiniz</label>
              <select name="model_id" required className="w-full border p-3 rounded" onChange={handleChange}>
                <option value="">Seçiniz</option>
                <optgroup label="BMW"><option value="1">BMW 320i</option><option value="2">BMW 520d</option><option value="3">BMW M4</option></optgroup>
                <optgroup label="Mercedes"><option value="4">Mercedes C200</option><option value="5">Mercedes E180</option><option value="6">Mercedes CLA200</option></optgroup>
                <optgroup label="Audi"><option value="7">Audi A3</option><option value="8">Audi A6</option></optgroup>
                <optgroup label="Honda"><option value="9">Honda Civic</option></optgroup>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2">Şehir</label>
              <select name="sehir_id" required className="w-full border p-3 rounded" onChange={handleChange}>
                <option value="">Seçiniz</option>
                <option value="1">İstanbul</option><option value="2">Ankara</option><option value="3">İzmir</option><option value="4">Bursa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block font-bold mb-2">Yıl</label><input type="number" name="yil" required className="w-full border p-3 rounded" onChange={handleChange} /></div>
            <div><label className="block font-bold mb-2">Fiyat (TL)</label><input type="number" name="fiyat" required className="w-full border p-3 rounded" onChange={handleChange} /></div>
          </div>

          <div>
            <label className="block font-bold mb-2">Kapak Fotoğrafı (Zorunlu)</label>
            <input type="text" name="resim_url" required placeholder="https://..." className="w-full border p-3 rounded" onChange={handleChange} />
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <label className="block font-bold mb-2 text-gray-700">Galeri Fotoğrafları (Opsiyonel)</label>
            {extraPhotos.map((photo, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder={`Ekstra Resim URL #${index + 1}`}
                  value={photo}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                />
                {extraPhotos.length > 1 && (
                  <button type="button" onClick={() => removePhotoField(index)} className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200">X</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPhotoField} className="text-blue-600 text-sm font-bold hover:underline mt-1">
              + Başka Fotoğraf Ekle
            </button>
          </div>

          <div>
            <label className="block font-bold mb-2">Açıklama</label>
            <textarea name="aciklama" required rows="3" className="w-full border p-3 rounded" onChange={handleChange}></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 text-white font-bold py-3 px-8 rounded hover:bg-green-700 transition shadow-lg">
              İlanı ve Fotoları Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;