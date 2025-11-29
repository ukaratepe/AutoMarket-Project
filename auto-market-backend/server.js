const express = require('express');
const cors = require('cors');
const db = require('./db'); // Veritabanı bağlantısını çağır
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const carRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const favoriteRoutes = require('./routes/favorites');

// Middleware (Ara Yazılımlar)
app.use(cors()); // Frontend erişimine izin ver
app.use(express.json()); // JSON verilerini okuyabilmek için

// Rotalar
app.use('/api/cars', carRoutes); // Arabalar ile ilgili rotalar
app.use('/api/auth', authRoutes); // Kimlik doğrulama ile ilgili rotalar
app.use('/api/comments', commentRoutes); // Yorumlar ile ilgili rotalar
app.use('/api/orders', orderRoutes); // Siparişler ile ilgili rotalar
app.use('/api/admin', adminRoutes); // Admin ile ilgili rotalar
app.use('/api/favorites', favoriteRoutes); // Favoriler ile ilgili rotalar

// --- TEST ROTASI ---
// Tarayıcıdan http://localhost:5000/ adresine gidince bu çalışır
app.get('/', (req, res) => {
  res.send('AutoMarket API Çalışıyor! 🚀');
});

// --- VERİTABANI TEST ROTASI ---
// Tablodaki markaları çekip ekrana basalım
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM markalar');
    res.json({ mesaj: "Bağlantı Başarılı!", veriler: rows });
  } catch (error) {
    res.status(500).json({ hata: error.message });
  }
});

// Sunucuyu Dinle
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});