-- ==========================================================
-- BÖLÜM 1: BAŞLANGIÇ VE TEMİZLİK
-- ==========================================================

-- Veritabanı karakter seti ayarı (Türkçe karakter desteği için)
CREATE DATABASE IF NOT EXISTS auto_market CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auto_market;

-- Mevcut tabloları ve view'ları temizle (Hatasız yeniden kurulum için)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS favoriler;
DROP TABLE IF EXISTS siparisler;
DROP TABLE IF EXISTS yorumlar;
DROP TABLE IF EXISTS arac_fotolar;
DROP TABLE IF EXISTS arabalar;
DROP TABLE IF EXISTS kullanicilar;
DROP TABLE IF EXISTS modeller;
DROP TABLE IF EXISTS markalar;
DROP TABLE IF EXISTS sehirler;
DROP TABLE IF EXISTS roller;

DROP VIEW IF EXISTS view_tum_ilanlar;
DROP VIEW IF EXISTS view_siparis_detay;
DROP VIEW IF EXISTS view_sistem_istatistik;
DROP VIEW IF EXISTS view_yorum_detay;

SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================================
-- BÖLÜM 2: TABLO OLUŞTURMA (DDL - 3NF & BCNF UYUMLU)
-- ==========================================================

-- 1. ROLLER (Admin / User)
CREATE TABLE roller (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(20) NOT NULL UNIQUE
);

-- 2. ŞEHİRLER (Lokasyon)
CREATE TABLE sehirler (
    sehir_id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL UNIQUE
);

-- 3. MARKALAR (Araç Markaları)
CREATE TABLE markalar (
    marka_id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL UNIQUE
);

-- 4. MODELLER (Markaya Bağımlı)
CREATE TABLE modeller (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    marka_id INT NOT NULL,
    ad VARCHAR(50) NOT NULL,
    FOREIGN KEY (marka_id) REFERENCES markalar(marka_id) ON DELETE CASCADE
);

-- 5. KULLANICILAR (Üyeler)
CREATE TABLE kullanicilar (
    kullanici_id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL DEFAULT 2, -- Varsayılan: User
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, -- Login için Unique
    sifre VARCHAR(255) NOT NULL,
    kayit_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roller(rol_id)
);

-- 6. ARABALAR (Ana Tablo - İlanlar)
CREATE TABLE arabalar (
    araba_id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    model_id INT NOT NULL,
    sehir_id INT NOT NULL,
    fiyat DECIMAL(15, 2) NOT NULL,
    yil INT NOT NULL,
    aciklama TEXT,
    resim_url VARCHAR(255), -- Kapak Fotoğrafı
    tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Veri Bütünlüğü Kısıtları (Constraints)
    CONSTRAINT ck_fiyat_pozitif CHECK (fiyat > 0),
    CONSTRAINT ck_yil_mantikli CHECK (yil > 1900),

    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(kullanici_id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES modeller(model_id),
    FOREIGN KEY (sehir_id) REFERENCES sehirler(sehir_id)
);

-- 7. ARAÇ FOTOĞRAFLARI (Galeri İçin)
CREATE TABLE arac_fotolar (
    foto_id INT AUTO_INCREMENT PRIMARY KEY,
    araba_id INT NOT NULL,
    foto_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (araba_id) REFERENCES arabalar(araba_id) ON DELETE CASCADE
);

-- 8. YORUMLAR
CREATE TABLE yorumlar (
    yorum_id INT AUTO_INCREMENT PRIMARY KEY,
    araba_id INT NOT NULL,
    kullanici_id INT NOT NULL,
    metin TEXT NOT NULL,
    tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (araba_id) REFERENCES arabalar(araba_id) ON DELETE CASCADE,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(kullanici_id) ON DELETE CASCADE
);

-- 9. SİPARİŞLER
CREATE TABLE siparisler (
    siparis_id INT AUTO_INCREMENT PRIMARY KEY,
    araba_id INT NOT NULL,
    alici_id INT NOT NULL,
    durum ENUM('Beklemede', 'Onaylandı', 'İptal Edildi', 'Tamamlandı') DEFAULT 'Beklemede',
    tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (araba_id) REFERENCES arabalar(araba_id) ON DELETE CASCADE,
    FOREIGN KEY (alici_id) REFERENCES kullanicilar(kullanici_id)
);

-- 10. FAVORİLER
CREATE TABLE favoriler (
    favori_id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    araba_id INT NOT NULL,
    UNIQUE KEY unique_favori (kullanici_id, araba_id), -- Aynı araç 2 kere favorilenemez
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(kullanici_id) ON DELETE CASCADE,
    FOREIGN KEY (araba_id) REFERENCES arabalar(araba_id) ON DELETE CASCADE
);


-- ==========================================================
-- BÖLÜM 3: İNDEKSLEME (PERFORMANS)
-- ==========================================================

-- Filtreleme sorgularını hızlandırmak için
CREATE INDEX idx_araba_fiyat ON arabalar(fiyat);
CREATE INDEX idx_araba_yil ON arabalar(yil);

-- Kullanıcı arama (Admin paneli) için
CREATE INDEX idx_kullanici_adsoyad ON kullanicilar(ad, soyad);


-- ==========================================================
-- BÖLÜM 4: VIEW'LAR (GÖRÜNTÜLER - SQL SOYUTLAMA)
-- ==========================================================

-- 1. TÜM İLANLARI LİSTELEME VIEW'I
CREATE OR REPLACE VIEW view_tum_ilanlar AS
SELECT 
    a.araba_id,
    a.kullanici_id,
    a.fiyat,
    a.yil,
    a.aciklama,
    a.resim_url,
    a.tarih,
    a.model_id,
    a.sehir_id,
    COALESCE(m.ad, 'Belirsiz') AS marka,
    COALESCE(mo.ad, 'Belirsiz') AS model,
    COALESCE(s.ad, 'Belirsiz') AS sehir,
    k.ad AS satici_ad,
    k.soyad AS satici_soyad,
    k.email AS satici_email
FROM arabalar a
LEFT JOIN modeller mo ON a.model_id = mo.model_id
LEFT JOIN markalar m ON mo.marka_id = m.marka_id
LEFT JOIN sehirler s ON a.sehir_id = s.sehir_id
LEFT JOIN kullanicilar k ON a.kullanici_id = k.kullanici_id;

-- 2. SİPARİŞ DETAY VIEW'I
CREATE OR REPLACE VIEW view_siparis_detay AS
SELECT 
    sip.siparis_id,
    sip.durum,
    sip.tarih,
    sip.alici_id,
    a.araba_id,
    a.resim_url,
    a.fiyat,
    m.ad AS marka,
    mo.ad AS model,
    k_alici.ad AS alici_ad,
    k_alici.soyad AS alici_soyad,
    k_satici.ad AS satici_ad,
    k_satici.soyad AS satici_soyad
FROM siparisler sip
JOIN arabalar a ON sip.araba_id = a.araba_id
JOIN modeller mo ON a.model_id = mo.model_id
JOIN markalar m ON mo.marka_id = m.marka_id
JOIN kullanicilar k_alici ON sip.alici_id = k_alici.kullanici_id
JOIN kullanicilar k_satici ON a.kullanici_id = k_satici.kullanici_id;

-- 3. SİSTEM İSTATİSTİK VIEW'I
CREATE OR REPLACE VIEW view_sistem_istatistik AS
SELECT 
    (SELECT COUNT(*) FROM arabalar) AS toplam_arac,
    (SELECT COUNT(*) FROM siparisler) AS toplam_siparis,
    (SELECT COUNT(*) FROM kullanicilar) AS toplam_kullanici;

-- 4. YORUM DETAY VIEW'I
CREATE OR REPLACE VIEW view_yorum_detay AS
SELECT 
    y.yorum_id,
    y.araba_id,
    y.kullanici_id,
    y.metin,
    y.tarih,
    k.ad AS kullanici_ad,
    k.soyad AS kullanici_soyad,
    k.email AS kullanici_email,
    m.ad AS marka,
    mo.ad AS model
FROM yorumlar y
JOIN kullanicilar k ON y.kullanici_id = k.kullanici_id
JOIN arabalar a ON y.araba_id = a.araba_id
JOIN modeller mo ON a.model_id = mo.model_id
JOIN markalar m ON mo.marka_id = m.marka_id;


-- ==========================================================
-- BÖLÜM 5: ÖRNEK VERİ YÜKLEME (SEED DATA)
-- ==========================================================

-- Roller
INSERT INTO roller (ad) VALUES ('admin'), ('user');

-- Şehirler
INSERT INTO sehirler (ad) VALUES ('İstanbul'), ('Ankara'), ('İzmir'), ('Bursa'), ('Antalya');

-- Markalar
INSERT INTO markalar (ad) VALUES ('BMW'), ('Mercedes'), ('Audi'), ('Honda'), ('Toyota');

-- Modeller (Marka ID'leri: 1-BMW, 2-Mercedes, 3-Audi, 4-Honda, 5-Toyota)
INSERT INTO modeller (marka_id, ad) VALUES 
(1, '320i'), (1, '520d'), (1, 'M4'),
(2, 'C200'), (2, 'E180'), (2, 'CLA 200'),
(3, 'A3'), (3, 'A6'),
(4, 'Civic'), (4, 'City'),
(5, 'Corolla');

-- Kullanıcılar (Şifre: 123456)
INSERT INTO kullanicilar (rol_id, ad, soyad, email, sifre) VALUES 
(1, 'Admin', 'Yönetici', 'admin@auto.com', '123456'),
(2, 'Ahmet', 'Yılmaz', 'ahmet@mail.com', '123456'),
(3, 'Ayşe', 'Kaya', 'ayse@mail.com', '123456');

-- Arabalar (Pexels Resim Kaynaklı)
INSERT INTO arabalar (kullanici_id, model_id, sehir_id, fiyat, yil, aciklama, resim_url) VALUES 
(2, 1, 1, 1500000, 2020, 'Sahibinden temiz, kazasız boyasız. M Sport paket.', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'),
(2, 4, 2, 1850000, 2019, 'Servis bakımlı, AMG paket, cam tavanlı.', 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=800'),
(3, 7, 3, 1400000, 2021, 'İlk sahibinden, garaj arabası. Hatasız.', 'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Araç Galeri Fotoları
INSERT INTO arac_fotolar (araba_id, foto_url) VALUES
(1, 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800'),
(1, 'https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&w=800'),
(2, 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800'),
(3, 'https://images.pexels.com/photos/241316/pexels-photo-241316.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Yorumlar
INSERT INTO yorumlar (araba_id, kullanici_id, metin) VALUES
(1, 3, 'Aracın son fiyatı nedir?'),
(2, 2, 'Takas düşünür müsünüz?');

-- Siparişler
INSERT INTO siparisler (araba_id, alici_id, durum) VALUES
(1, 3, 'Beklemede'),
(2, 3, 'Onaylandı');

-- Favoriler
INSERT INTO favoriler (kullanici_id, araba_id) VALUES
(3, 1);