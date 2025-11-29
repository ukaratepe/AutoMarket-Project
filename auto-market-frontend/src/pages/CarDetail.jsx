import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [araba, setAraba] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carRes, commentRes] = await Promise.all([
          api.get(`/cars/${id}`),
          api.get(`/comments/${id}`)
        ]);

        setAraba(carRes.data);
        setComments(commentRes.data);
        
        // DÜZELTME 1: resim yerine resim_url kullanıyoruz
        setActiveImage(carRes.data.resim_url); 
        
        setLoading(false);
      } catch (error) {
        console.error("Veri hatası:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post('/comments', {
        araba_id: id,
        kullanici_id: user.id,
        metin: newComment
      });

      const yeniYorum = {
        yorum_id: Date.now(),
        ad: user.name.split(' ')[0],
        soyad: user.name.split(' ')[1] || '',
        metin: newComment,
        tarih: new Date().toISOString()
      };
      
      setComments([yeniYorum, ...comments]);
      setNewComment("");
      alert("Yorumunuz başarıyla eklendi!");

    } catch (error) {
      console.error(error);
      alert("Yorum eklenirken hata oluştu.");
    }
  };

  const handleBuy = async () => {
    if (!user) {
      if(window.confirm("Sipariş vermek için giriş yapmalısınız. Giriş sayfasına gidilsin mi?")) {
        navigate('/giris');
      }
      return;
    }

    if (window.confirm(`${araba.marka} ${araba.model} aracı için sipariş talebi oluşturulsun mu?`)) {
      try {
        await api.post('/orders', { 
          araba_id: id, 
          alici_id: user.id 
        });
        alert("Sipariş talebiniz alındı! Satıcı sizinle iletişime geçecek.");
        navigate('/profil');
      } catch (error) {
        console.error("Sipariş hatası:", error);
        alert("Sipariş oluşturulamadı.");
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-xl text-gray-500">Yükleniyor...</div>;
  if (!araba) return <div className="text-center py-20 text-xl text-red-500">İlan Bulunamadı!</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/ilanlar" className="text-gray-500 hover:text-gray-800 mb-6 inline-block font-medium">
        ← İlanlara Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        
        {/* --- SOL TARAF: RESİM GALERİSİ --- */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            {/* DÜZELTME 2: araba.resim_url kullanıyoruz */}
            <img 
              src={activeImage || araba.resim_url} 
              alt={araba.model} 
              className="w-full h-[400px] object-cover rounded-lg transition-all duration-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://dummyimage.com/600x400/cccccc/000000&text=Resim+Yok"; }}
            />
          </div>

          {araba.fotolar && araba.fotolar.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* Kapak Fotoğrafı (Thumbnail) */}
              <img 
                src={araba.resim_url} // DÜZELTME 3
                onClick={() => setActiveImage(araba.resim_url)} // DÜZELTME 4
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 hover:opacity-80 transition
                  ${activeImage === araba.resim_url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'}`}
                alt="Kapak"
              />
              
              {/* Ekstra Fotoğraflar */}
              {araba.fotolar.map((fotoUrl, index) => (
                <img 
                  key={index}
                  src={fotoUrl}
                  onClick={() => setActiveImage(fotoUrl)}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 hover:opacity-80 transition
                    ${activeImage === fotoUrl ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'}`}
                  alt={`Ekstra ${index}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- SAĞ TARAF: ARAÇ BİLGİLERİ --- */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{araba.marka} {araba.model}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-lg">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">{araba.yil}</span>
              <span>•</span>
              <span>{araba.sehir}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Satıcı: <span className="font-semibold text-gray-600">{araba.satici_ad} {araba.satici_soyad}</span>
            </p>
          </div>

          <div className="text-4xl font-bold text-blue-600">
            {Number(araba.fiyat).toLocaleString('tr-TR')} ₺
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Araç Açıklaması</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {araba.aciklama}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
              Mesaj At
            </button>
            <button 
              onClick={handleBuy} 
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              Hemen Al (Sipariş Ver)
            </button>
          </div>
        </div>
      </div>
      
      {/* --- YORUMLAR KISMI (AYNI) --- */}
      <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          💬 Yorumlar ve Sorular 
          <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{comments.length}</span>
        </h2>

        <div className="space-y-6 mb-10">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.yorum_id || comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                      {comment.ad ? comment.ad.charAt(0) : 'U'}
                    </div>
                    {comment.ad} {comment.soyad}
                  </span>
                  <span className="text-xs text-gray-400">
                    {comment.tarih ? new Date(comment.tarih).toLocaleDateString('tr-TR') : ''}
                  </span>
                </div>
                <p className="text-gray-600 pl-10">{comment.metin}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 italic">Henüz yorum yapılmamış. İlk soruyu sen sor!</p>
            </div>
          )}
        </div>

        {user ? (
          <form onSubmit={handleAddComment} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Yorum Yap / Soru Sor</h3>
            <textarea
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
              rows="3"
              placeholder="Araç hakkında merak ettiklerinizi yazın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <div className="mt-4 text-right">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow"
              >
                Gönder
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg text-center">
            <p className="mb-2">Bu araca yorum yapabilmek veya soru sorabilmek için giriş yapmalısınız.</p>
            <Link to="/giris" className="font-bold underline hover:text-yellow-900">Giriş Yapmak İçin Tıklayın</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetail;