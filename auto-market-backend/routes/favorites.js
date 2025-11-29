const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. KULLANICININ FAVORİLERİNİ GETİR (GET /api/favorites/:userId)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Sadece araba_id'leri dönmemiz yeterli (Frontend'de kontrol için)
    const sql = 'SELECT araba_id FROM favoriler WHERE kullanici_id = ?';
    const [rows] = await db.query(sql, [userId]);
    
    // Sonucu basit bir diziye çeviriyoruz: [1, 3, 5] gibi
    const favoriteIds = rows.map(row => row.araba_id);
    res.json(favoriteIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Favoriler çekilemedi.' });
  }
});

// 2. FAVORİ EKLE (POST /api/favorites)
router.post('/', async (req, res) => {
  try {
    const { kullanici_id, araba_id } = req.body;
    // IGNORE: Eğer zaten ekliyse hata verme, geç
    const sql = 'INSERT IGNORE INTO favoriler (kullanici_id, araba_id) VALUES (?, ?)';
    await db.query(sql, [kullanici_id, araba_id]);
    res.json({ message: 'Favorilere eklendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ekleme başarısız.' });
  }
});

// 3. FAVORİ SİL (DELETE /api/favorites/:userId/:carId)
router.delete('/:userId/:carId', async (req, res) => {
  try {
    const { userId, carId } = req.params;
    const sql = 'DELETE FROM favoriler WHERE kullanici_id = ? AND araba_id = ?';
    await db.query(sql, [userId, carId]);
    res.json({ message: 'Favorilerden çıkarıldı.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Silme başarısız.' });
  }
});

module.exports = router;