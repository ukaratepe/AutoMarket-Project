import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Kullanıcılar çekilemedi:", err);
        setError("Veri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u.kullanici_id !== id));
      } catch (err) {
        alert("Silme işlemi başarısız.");
      }
    }
  };

  // --- DÜZELTİLEN FİLTRELEME MANTIĞI ---
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    
    // 1. Ad ve Soyadı birleştirip tek bir metin gibi düşünelim
    const fullName = `${user.ad} ${user.soyad}`.toLowerCase();
    const email = user.email.toLowerCase();

    // 2. Arama terimi bu birleşik ismin içinde geçiyor mu?
    return fullName.includes(term) || email.includes(term);
  });
  // --------------------------------------

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white hidden md:block">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="mt-6 space-y-2">
          <Link to="/admin" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">İlan Yönetimi</Link>
          <Link to="/admin/kullanicilar" className="block py-3 px-6 bg-gray-700 border-l-4 border-blue-500 text-white">Kullanıcılar</Link>
          <Link to="/admin/yorumlar" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">Yorumlar</Link>
          <Link to="/admin/siparisler" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">Siparişler</Link>
          <Link to="/" className="block py-3 px-6 mt-10 hover:bg-red-600 text-gray-400 hover:text-white">← Siteye Dön</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ad Soyad veya E-posta ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Ad Soyad</th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Rol</th>
                <th className="px-5 py-3 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.kullanici_id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">#{user.kullanici_id}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">{user.ad} {user.soyad}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-500">{user.email}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${user.rol === 'Admin' || user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <button 
                        onClick={() => handleDelete(user.kullanici_id)} 
                        className="text-red-600 hover:text-red-900 font-bold bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    Aradığınız kriterlere uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;