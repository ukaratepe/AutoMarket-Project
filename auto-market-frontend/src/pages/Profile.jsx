import { useEffect, useState } from 'react'; // useState ve useEffect EKLENDİ
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../api'; // API EKLENDİ

const Profile = () => {
  const { user, logout } = useAuth();
  const [myOrders, setMyOrders] = useState([]); // State'e çevirdik

  // Kullanıcı varsa siparişlerini çek
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await api.get(`/orders/user/${user.id}`);
          setMyOrders(res.data);
        } catch (error) {
          console.error("Siparişler çekilemedi:", error);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/giris" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profilim</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Kart (Aynı kalıyor) */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-600 text-white text-4xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-200 text-xs rounded-full uppercase font-bold text-gray-600">
                {user.role}
              </span>
            </div>
            <button onClick={logout} className="w-full bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 transition font-semibold">
              Çıkış Yap
            </button>
          </div>

          {/* Sağ Taraf: Sipariş Geçmişi (VERİTABANINDAN GELİYOR) */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Sipariş Geçmişim</h3>
              
              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                      <div>
                        <div className="font-bold text-lg">{order.marka} {order.model}</div>
                        <div className="text-sm text-gray-500">
                           Tarih: {new Date(order.tarih).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <div className="font-bold text-gray-800">
                          {Number(order.fiyat).toLocaleString('tr-TR')} ₺
                        </div>
                        <span className={`text-xs px-2 py-1 rounded font-bold
                          ${order.durum === 'Tamamlandı' ? 'text-green-600 bg-green-100' : 
                            order.durum === 'İptal Edildi' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
                          {order.durum}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Henüz bir siparişiniz bulunmuyor.</p>
              )}
            </div>
            
            {/* Favori Linki (Aynı kalıyor) */}
             <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">Favori İlanların</h4>
              <p className="text-sm text-blue-600 mb-3">Beğendiğin araçlara hızlıca ulaşmak ister misin?</p>
              <Link to="/favoriler" className="text-sm font-bold underline hover:text-blue-800">Favorilerime Git →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;