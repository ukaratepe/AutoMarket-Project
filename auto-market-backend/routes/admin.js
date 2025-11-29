const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. TÜM KULLANICILARI GETİR
router.get('/users', async (req, res) => {
  const [rows] = await db.query('SELECT k.*, r.ad as rol FROM kullanicilar k JOIN roller r ON k.rol_id = r.rol_id');
  res.json(rows);
});

// 2. KULLANICI SİL
router.delete('/users/:id', async (req, res) => {
  await db.query('DELETE FROM kullanicilar WHERE kullanici_id = ?', [req.params.id]);
  res.json({ message: 'Kullanıcı silindi' });
});

// 3. TÜM YORUMLARI GETİR (View Kullanarak)
router.get('/comments', async (req, res) => {
  try {
    const sql = 'SELECT * FROM view_yorum_detay ORDER BY tarih DESC';
    const [rows] = await db.query(sql);
    
    // Frontend uyumu için (AdminComments.jsx 'ad' 'soyad' bekliyor)
    const formattedRows = rows.map(row => ({
        ...row,
        ad: row.kullanici_ad,
        soyad: row.kullanici_soyad
    }));
    
    res.json(formattedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Yorumlar çekilemedi' });
  }
});

// 4. YORUM SİL
router.delete('/comments/:id', async (req, res) => {
  await db.query('DELETE FROM yorumlar WHERE yorum_id = ?', [req.params.id]);
  res.json({ message: 'Yorum silindi' });
});

// 5. İSTATİSTİKLER (View Kullanarak)
router.get('/stats', async (req, res) => {
  try {
    // ESKİ: 3 tane ayrı await db.query(...) vardı.
    // YENİ: Tek bir View sorgusu.
    const [rows] = await db.query('SELECT * FROM view_sistem_istatistik');
    
    // View tek satır döndürür
    const stats = rows[0]; 

    res.json({
      cars: stats.toplam_arac,
      orders: stats.toplam_siparis,
      users: stats.toplam_kullanici
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'İstatistik hatası' });
  }
});

module.exports = router;