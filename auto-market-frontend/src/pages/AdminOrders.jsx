import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Sipariş hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { durum: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, durum: newStatus } : o));
    } catch (error) {
      alert("Güncelleme başarısız");
    }
  };

  if (loading) return <div className="p-10">Yükleniyor...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
       {/* Sidebar (Kopyala yapıştır yapabilirsin) */}
       <aside className="w-64 bg-gray-800 text-white hidden md:block">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="mt-6 space-y-2">
          <Link to="/admin" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">İlan Yönetimi</Link>
          <Link to="/admin/kullanicilar" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">Kullanıcılar</Link>
          <Link to="/admin/yorumlar" className="block py-3 px-6 text-gray-400 hover:bg-gray-700 hover:text-white">Yorumlar</Link>
          <Link to="/admin/siparisler" className="block py-3 px-6 bg-gray-700 border-l-4 border-blue-500 text-white">Siparişler</Link>
          <Link to="/" className="block py-3 px-6 mt-10 hover:bg-red-600 text-gray-400 hover:text-white">← Siteye Dön</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sipariş Yönetimi</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs uppercase">ID</th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs uppercase">Alıcı</th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs uppercase">Araç</th>
                <th className="px-5 py-3 bg-gray-100 text-left text-xs uppercase">Durum</th>
                <th className="px-5 py-3 bg-gray-100 text-right text-xs uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-5 border-b bg-white text-sm">#{order.id}</td>
                  <td className="px-5 py-5 border-b bg-white text-sm">{order.alici_ad} {order.alici_soyad}</td>
                  <td className="px-5 py-5 border-b bg-white text-sm">{order.marka} {order.model}</td>
                  <td className="px-5 py-5 border-b bg-white text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold 
                      ${order.durum === 'Onaylandı' ? 'bg-green-100 text-green-800' : 
                      order.durum === 'İptal Edildi' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.durum}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b bg-white text-sm text-right">
                    {order.durum === 'Beklemede' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(order.id, 'Onaylandı')} className="text-green-600 font-bold">Onayla</button>
                        <button onClick={() => updateStatus(order.id, 'İptal Edildi')} className="text-red-600 font-bold">Reddet</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;