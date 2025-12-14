# 🚀 CP-SPSM (Sistem Pendaftaran & Manajemen Sekolah) Tugas Capstone

> **CP-SPSM** adalah aplikasi web untuk **manajemen pendaftaran dan administrasi sekolah** yang dirancang dengan arsitektur **client–server**. Aplikasi ini memisahkan backend dan frontend agar mudah dikembangkan, dipelihara, dan diskalakan.

---

## 📌 Ringkasan Proyek

* **Backend**: Node.js + Express dengan database SQL
  Struktur API berbasis fitur (feature-based architecture) yang berada di `Backend/src/features`.

* **Frontend**: React (Create React App) + Tailwind CSS
  Bertugas menangani antarmuka pengguna dan komunikasi dengan API backend.

---


## ⚙️ Persyaratan Sistem

Pastikan lingkungan pengembangan sudah memenuhi persyaratan berikut:

* **Node.js** (disarankan versi ≥ 14)
* **npm** atau **yarn**
* **Database SQL** (MySQL / MariaDB atau yang sejenis)

---


## ▶️ Menjalankan Aplikasi (Mode Pengembangan)

### 1️⃣ Menjalankan Backend

```bash
cd Backend
npm install
node server.js
```

> Alternatif: gunakan `npm run start` atau `npm run dev` jika sudah didefinisikan di `Backend/package.json`.

---

### 2️⃣ Menjalankan Frontend

```bash
cd frontend
npm install
npm start
```

Aplikasi frontend akan berjalan secara default di:

```
http://localhost:3000
```



## 🛠️ Catatan Pengembangan

### Backend

* Setiap fitur berada di:

  ```
  Backend/src/features/{nama-fitur}
  ```

  dan umumnya berisi:

  * `controller`
  * `routes`
  * `service`
  * `model`

* Middleware umum tersedia di:

  ```
  Backend/src/middlewares
  ```

  (auth, authorization, logging, rate limiter, sanitization, dll)

* Route utama digabungkan di:

  ```
  Backend/src/routes/index.js
  ```

### Frontend

* Halaman aplikasi: `frontend/src/pages`
* Komponen reusable: `frontend/src/components`
* Layanan API: `frontend/src/services`

---

## 🤝 Kontribusi

Kontribusi sangat terbuka. Silakan ikuti alur berikut:

1. Buat branch baru untuk setiap fitur atau perbaikan
2. Lakukan commit dengan pesan yang jelas
3. Ajukan Pull Request dengan deskripsi perubahan


## 📝 Catatan Akhir

README ini disusun sebagai **panduan awal** untuk memahami dan menjalankan proyek CP-SPSM.

➡️ Dapat dikembangkan lebih lanjut dengan:

* Contoh file `.env`
* Panduan setup database lengkap
* Dokumentasi API / Postman Collection
