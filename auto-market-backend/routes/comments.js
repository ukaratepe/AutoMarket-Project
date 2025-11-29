const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. BİR ARACA AİT YORUMLARI GETİR (GET /api/comments/:araba_id)
router.get('/:araba_id', async (req, res) => {
  try {
    const { araba_id } = req.params;
    // Yorumu yapan kişinin adını da (JOIN ile) alıyoruz
    const sql = `
      SELECT y.*, k.ad, k.soyad 
      FROM yorumlar y
      JOIN kullanicilar k ON y.kullanici_id = k.kullanici_id
      WHERE y.araba_id = ?
      ORDER BY y.tarih DESC
    `;
    const [rows] = await db.query(sql, [araba_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Yorumlar yüklenemedi.' });
  }
});

// 2. YENİ YORUM EKLE (POST /api/comments)
router.post('/', async (req, res) => {
  try {
    const { araba_id, kullanici_id, metin } = req.body;
    
    const sql = 'INSERT INTO yorumlar (araba_id, kullanici_id, metin) VALUES (?, ?, ?)';
    await db.query(sql, [araba_id, kullanici_id, metin]);

    res.status(201).json({ message: 'Yorum başarıyla eklendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Yorum eklenemedi.' });
  }
});

module.exports = router;