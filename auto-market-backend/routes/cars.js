const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. TÜM ARABALARI LİSTELEME
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM view_tum_ilanlar ORDER BY tarih DESC';
    const [rows] = await db.query(sql);
    
    // FRONTEND UYUMU İÇİN DÖNÜŞTÜRME (MAPPING)
    // Frontend 'id' bekliyor, View 'araba_id' veriyor.
    const formattedRows = rows.map(car => ({
      ...car,
      id: car.araba_id,      // araba_id -> id
      resim: car.resim_url   // resim_url -> resim (Yedek olarak)
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("View Hatası:", error);
    res.status(500).json({ error: 'Veriler çekilemedi.' });
  }
});

// 2. TEK BİR ARABA DETAYI
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sqlCar = 'SELECT * FROM view_tum_ilanlar WHERE araba_id = ?';
    const [carRows] = await db.query(sqlCar, [id]);

    if (carRows.length === 0) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    // Tekil kayıt için de dönüşüm yapalım
    const car = {
        ...carRows[0],
        id: carRows[0].araba_id // Frontend için id ekle
    };

    // Ekstra fotoları çek
    const sqlPhotos = 'SELECT foto_url FROM arac_fotolar WHERE araba_id = ?';
    const [photoRows] = await db.query(sqlPhotos, [id]);
    car.fotolar = photoRows.map(p => p.foto_url);

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// 3. YENİ ARABA EKLEME (Aynı Kalıyor)
router.post('/', async (req, res) => {
  try {
    const { kullanici_id, model_id, sehir_id, fiyat, yil, aciklama, resim_url, fotolar } = req.body;
    const sqlCar = `INSERT INTO arabalar (kullanici_id, model_id, sehir_id, fiyat, yil, aciklama, resim_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sqlCar, [kullanici_id, model_id, sehir_id, fiyat, yil, aciklama, resim_url]);
    
    const yeniArabaId = result.insertId;

    if (fotolar && Array.isArray(fotolar)) {
      const validPhotos = fotolar.filter(url => url.trim() !== "");
      if (validPhotos.length > 0) {
        const photoValues = validPhotos.map(url => [yeniArabaId, url]);
        await db.query('INSERT INTO arac_fotolar (araba_id, foto_url) VALUES ?', [photoValues]);
      }
    }
    res.status(201).json({ message: 'Eklendi', id: yeniArabaId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ekleme başarısız.' });
  }
});

// 4. SİLME (Aynı Kalıyor)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM arabalar WHERE araba_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Bulunamadı.' });
    res.json({ message: 'Silindi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Silinemedi.' });
  }
});

// 5. GÜNCELLEME (Aynı Kalıyor)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { model_id, sehir_id, fiyat, yil, aciklama, resim_url, fotolar } = req.body;

    const sqlUpdate = `UPDATE arabalar SET model_id=?, sehir_id=?, fiyat=?, yil=?, aciklama=?, resim_url=? WHERE araba_id=?`;
    await db.query(sqlUpdate, [model_id, sehir_id, fiyat, yil, aciklama, resim_url, id]);

    if (fotolar && Array.isArray(fotolar)) {
      await db.query('DELETE FROM arac_fotolar WHERE araba_id = ?', [id]);
      const validPhotos = fotolar.filter(url => url.trim() !== "");
      if (validPhotos.length > 0) {
        const photoValues = validPhotos.map(url => [id, url]);
        await db.query('INSERT INTO arac_fotolar (araba_id, foto_url) VALUES ?', [photoValues]);
      }
    }
    res.json({ message: 'Güncellendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Güncellenemedi.' });
  }
});

module.exports = router;