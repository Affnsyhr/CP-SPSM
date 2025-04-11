# Panduan Kolaborator 

Terima kasih telah berkontribusi dalam proyek pengembangan website **Sistem Penerimaan Siswa Madrasah**! 

Berikut adalah langkah-langkah kontribusi untuk kolaborator:

## ⚙️ Persiapan Awal

1. **Fork atau clone repository ini** (jika sudah menjadi kolaborator langsung clone saja).
   ```bash
   git clone <repository-url>
   cd <nama-folder-repo>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Siapkan environment dengan membuat file `.env` dan sesuaikan konfigurasi database.

## 🛠️ Prosedur Kontribusi

1. **Buat Branch Baru**  
   Buat branch baru untuk setiap fitur atau perbaikan:
   ```bash
   git checkout -b nama-fitur-atau-perbaikan
   ```

2. **Lakukan Perubahan**  
   Edit atau tambahkan kode sesuai dengan fitur atau perbaikan yang ingin kamu kontribusikan.

3. **Commit Perubahan**  
   Gunakan pesan commit yang deskriptif dan jelas:
   ```bash
   git add .
   git commit -m "Menambahkan fitur verifikasi pendaftaran siswa"
   ```

4. **Push ke Remote**  
   Push branch kamu ke GitHub:
   ```bash
   git push origin nama-fitur-atau-perbaikan
   ```

5. **Buat Pull Request (PR)**  
   - Buka GitHub dan pergi ke repository.  
   - Akan muncul notifikasi untuk membuat Pull Request dari branch baru.  
   - Klik **Compare & pull request**.  
   - Tambahkan deskripsi perubahan, lalu klik **Create pull request**.

## ✅ Aturan Kode

- Gunakan bahasa yang konsisten (JavaScript atau TypeScript jika sudah ditentukan).
- Format kode sebelum commit menggunakan Prettier atau linter jika tersedia.
- Jangan lupa untuk mengetes kode sebelum mengirim PR.

## 🔄 Sinkronisasi dengan Branch `main`

Sebelum mulai kerja atau setelah PR kamu di-merge, pastikan branch `main` lokal kamu sinkron:
```bash
git checkout main
git pull origin main
```