import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    model_id: '',
    sehir_id: '',
    fiyat: '',
    yil: '',
    aciklama: '',
    resim_url: ''
  });

  // EKSTRA FOTOLAR İÇİN STATE
  const [extraPhotos, setExtraPhotos] = useState([""]);

  // 1. Verileri Veritabanından Çek ve Doldur
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        
        // Ana bilgileri doldur
        setFormData({
          model_id: res.data.model_id,
          sehir_id: res.data.sehir_id,
          fiyat: res.data.fiyat,
          yil: res.data.yil,
          aciklama: res.data.aciklama,
          resim_url: res.data.resim_url
        });

        // Ekstra fotolar varsa onları state'e at, yoksa 1 tane boş kutu koy
        if (res.data.fotolar && res.data.fotolar.length > 0) {
          setExtraPhotos(res.data.fotolar);
        } else {
          setExtraPhotos([""]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Hata:", error);
        alert("Araç bulunamadı!");
        navigate('/admin');
      }
    };
    fetchCar();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FOTOĞRAF YÖNETİM FONKSİYONLARI ---
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
  // ---------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PUT isteği ile güncelle (Fotoları da gönderiyoruz)
      const payload = {
        ...formData,
        fotolar: extraPhotos
      };

      await api.put(`/cars/${id}`, payload);
      alert("İlan ve fotoğraflar başarıyla güncellendi!");
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert("Güncelleme sırasında hata oluştu.");
    }
  };

  if (loading) return <div className="p-10 text-center">Veriler yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="bg-blue-800 text-white p-6 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold">İlanı Düzenle</h2>
          <Link to="/admin" className="text-blue-200 hover:text-white text-sm">İptal Et</Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* MODEL SEÇİMİ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">Model</label>
              <select name="model_id" value={formData.model_id} onChange={handleChange} className="w-full border p-3 rounded bg-gray-50">
                <option value="">Seçiniz</option>
                <optgroup label="BMW"><option value="1">BMW 320i</option><option value="2">BMW 520d</option><option value="3">BMW M4</option></optgroup>
                <optgroup label="Mercedes"><option value="4">Mercedes C200</option><option value="5">Mercedes E180</option><option value="6">Mercedes CLA200</option></optgroup>
                <optgroup label="Audi"><option value="7">Audi A3</option><option value="8">Audi A6</option></optgroup>
                <optgroup label="Honda"><option value="9">Honda Civic</option></optgroup>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">Şehir</label>
              <select name="sehir_id" value={formData.sehir_id} onChange={handleChange} className="w-full border p-3 rounded bg-gray-50">
                <option value="">Seçiniz</option>
                <option value="1">İstanbul</option><option value="2">Ankara</option><option value="3">İzmir</option><option value="4">Bursa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block font-bold mb-2">Yıl</label><input type="number" name="yil" value={formData.yil} onChange={handleChange} className="w-full border p-3 rounded" /></div>
            <div><label className="block font-bold mb-2">Fiyat (TL)</label><input type="number" name="fiyat" value={formData.fiyat} onChange={handleChange} className="w-full border p-3 rounded" /></div>
          </div>

          {/* KAPAK FOTOĞRAFI */}
          <div>
            <label className="block font-bold mb-2">Kapak Fotoğrafı URL</label>
            <input type="text" name="resim_url" value={formData.resim_url} onChange={handleChange} className="w-full border p-3 rounded" />
          </div>

          {/* --- YENİ: EKSTRA FOTOĞRAF DÜZENLEME ALANI --- */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <label className="block font-bold mb-2 text-gray-700">Galeri Fotoğrafları</label>
            <p className="text-xs text-gray-500 mb-3">Linkleri değiştirebilir veya 'X' ile silebilirsiniz.</p>
            
            {extraPhotos.map((photo, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder={`Ekstra Resim URL #${index + 1}`}
                  value={photo}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                />
                <button type="button" onClick={() => removePhotoField(index)} className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200 font-bold">X</button>
              </div>
            ))}
            
            <button type="button" onClick={addPhotoField} className="text-blue-600 text-sm font-bold hover:underline mt-1">
              + Yeni Fotoğraf Alanı Ekle
            </button>
          </div>
          {/* ---------------------------------------------- */}

          <div>
            <label className="block font-bold mb-2">Açıklama</label>
            <textarea name="aciklama" rows="4" value={formData.aciklama} onChange={handleChange} className="w-full border p-3 rounded"></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition">
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;