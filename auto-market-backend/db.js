const mysql = require('mysql2');
require('dotenv').config();

// Bağlantı Havuzu (Pool) Oluşturma
// Pool, performans için bağlantıları açık tutar ve yönetir.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Bağlantıyı test et
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Veritabanı bağlantı hatası:', err.code);
    console.error('Hata Detayı:', err.sqlMessage);
  } else {
    console.log('✅ Veritabanına başarıyla bağlanıldı!');
    connection.release(); // Bağlantıyı havuza geri bırak
  }
});

// Promise (Async/Await) yapısını kullanabilmek için
module.exports = pool.promise();