import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get('/admin/comments');
        if (Array.isArray(res.data)) {
          setComments(res.data);
        }
      } catch (err) {
        console.error("Yorum hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/admin/comments/${id}`);
        setComments(comments.filter(c => c.yorum_id !== id));
      } catch (error) {
        alert("Silinemedi");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white hidden md:block">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="mt-6 space-y-2">
          <Link to="/admin" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">İlan Yönetimi</Link>
          <Link to="/admin/kullanicilar" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">Kullanıcılar</Link>
          <Link to="/admin/yorumlar" className="block py-3 px-6 bg-gray-700 border-l-4 border-blue-500 text-white">Yorumlar</Link>
          <Link to="/admin/siparisler" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">Siparişler</Link>
          <Link to="/" className="block py-3 px-6 mt-10 hover:bg-red-600 text-gray-400 hover:text-white">← Siteye Dön</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Yorum Yönetimi</h1>
        
        {comments.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">Henüz yorum yapılmamış.</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.yorum_id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-800">{comment.ad} {comment.soyad}</span>
                    <span className="text-sm text-gray-500">({comment.marka} {comment.model})</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(comment.tarih).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  {/* --- DÜZELTME BURADA YAPILDI: comment.metin --- */}
                  <p className="text-gray-700">{comment.metin}</p>
                  {/* --------------------------------------------- */}
                  
                </div>
                <button 
                  onClick={() => handleDelete(comment.yorum_id)} 
                  className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition font-bold"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminComments;