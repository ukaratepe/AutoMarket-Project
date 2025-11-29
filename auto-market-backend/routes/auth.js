const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. KAYIT OLMA (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { ad, soyad, email, sifre } = req.body;

    // Önce bu email kayıtlı mı diye bak
    const [existingUser] = await db.query('SELECT * FROM kullanicilar WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanılıyor.' });
    }

    // Yeni kullanıcıyı ekle (Varsayılan rol: User yani ID 2)
    const sql = `INSERT INTO kullanicilar (rol_id, ad, soyad, email, sifre) VALUES (2, ?, ?, ?, ?)`;
    await db.query(sql, [ad, soyad, email, sifre]);

    res.status(201).json({ message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu.' });
  }
});

// 2. GİRİŞ YAPMA (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, sifre } = req.body;

    // Kullanıcıyı bul
    // Rol adını da almak için JOIN yapıyoruz
    const sql = `
      SELECT k.*, r.ad as rol_adi 
      FROM kullanicilar k 
      JOIN roller r ON k.rol_id = r.rol_id 
      WHERE email = ? AND sifre = ?
    `;
    const [users] = await db.query(sql, [email, sifre]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Hatalı e-posta veya şifre!' });
    }

    const user = users[0];

    // Frontend'in beklediği formatta veriyi gönder
    res.json({
      id: user.kullanici_id,
      name: `${user.ad} ${user.soyad}`,
      email: user.email,
      role: user.rol_adi // 'admin' veya 'user'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Giriş işlemi başarısız.' });
  }
});

module.exports = router;