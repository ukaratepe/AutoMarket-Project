const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. YENİ SİPARİŞ OLUŞTUR (Kullanıcı İçin)
router.post('/', async (req, res) => {
  try {
    const { araba_id, alici_id } = req.body;
    const sql = 'INSERT INTO siparisler (araba_id, alici_id) VALUES (?, ?)';
    await db.query(sql, [araba_id, alici_id]);
    res.status(201).json({ message: 'Sipariş oluşturuldu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sipariş hatası.' });
  }
});

// 2. TÜM SİPARİŞLERİ GETİR (Admin İçin - View ile)
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM view_siparis_detay ORDER BY tarih DESC';
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Veri çekilemedi.' });
  }
});

// 3. SİPARİŞ DURUMU GÜNCELLE (Admin İçin)
router.put('/:id', async (req, res) => {
  try {
    const { durum } = req.body;
    const { id } = req.params;
    await db.query('UPDATE siparisler SET durum = ? WHERE siparis_id = ?', [durum, id]);
    res.json({ message: 'Durum güncellendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Güncelleme hatası.' });
  }
});

// 4. KULLANICININ SİPARİŞLERİ (Profil İçin - View ile)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sql = 'SELECT * FROM view_siparis_detay WHERE alici_id = ? ORDER BY tarih DESC';
    const [rows] = await db.query(sql, [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sipariş geçmişi çekilemedi.' });
  }
});

module.exports = router;