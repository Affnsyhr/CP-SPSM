CREATE TABLE role (
  role_id SERIAL PRIMARY KEY,
  nama_role VARCHAR(20) NOT NULL UNIQUE,
  deskripsi TEXT
);

CREATE INDEX idx_role_nama_role ON role (nama_role);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP,
  role_id INTEGER NOT NULL REFERENCES role(role_id)
);

CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role_id ON users (role_id);

CREATE TABLE orang_tua (
  user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
  nama_lengkap VARCHAR(100) NOT NULL,
  nik VARCHAR(20) UNIQUE,
  alamat TEXT,
  no_hp VARCHAR(15)
);

CREATE INDEX idx_orang_tua_nik ON orang_tua (nik);

CREATE TABLE siswa (
  siswa_id SERIAL PRIMARY KEY,
  orang_tua_id INTEGER REFERENCES orang_tua(user_id),
  nama_lengkap VARCHAR(100) NOT NULL,
  tempat_lahir VARCHAR(50),
  tanggal_lahir DATE,
  jenis_kelamin VARCHAR(1),
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_siswa_orang_tua_id ON siswa (orang_tua_id);
CREATE INDEX idx_siswa_nama_lengkap ON siswa (nama_lengkap);

CREATE TABLE program_sekolah (
  program_id SERIAL PRIMARY KEY,
  nama_program VARCHAR(50) NOT NULL UNIQUE,
  deskripsi TEXT,
  status_program VARCHAR(10) DEFAULT 'aktif'
);

CREATE INDEX idx_program_sekolah_status_program ON program_sekolah (status_program);

CREATE TABLE periode_pendaftaran (
  periode_id SERIAL PRIMARY KEY,
  nama_periode VARCHAR(50) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_berakhir DATE NOT NULL,
  status VARCHAR(10) DEFAULT 'nonaktif',
  created_by INTEGER REFERENCES users(user_id)
);

CREATE INDEX idx_periode_pendaftaran_status ON periode_pendaftaran (status);
CREATE INDEX idx_periode_pendaftaran_created_by ON periode_pendaftaran (created_by);

CREATE TABLE dokumen_pendaftaran (
  dokumen_id SERIAL PRIMARY KEY,
  siswa_id INTEGER REFERENCES siswa(siswa_id),
  jenis_dokumen VARCHAR(50) NOT NULL,
  nama_file VARCHAR(255),
  status_verifikasi VARCHAR(20) DEFAULT 'menunggu',
  tanggal_upload TIMESTAMP,
  tanggal_verifikasi TIMESTAMP,
  verified_by INTEGER REFERENCES users(user_id),
  catatan TEXT
);

CREATE INDEX idx_dokumen_pendaftaran_siswa_id ON dokumen_pendaftaran (siswa_id);
CREATE INDEX idx_dokumen_pendaftaran_status_verifikasi ON dokumen_pendaftaran (status_verifikasi);
CREATE INDEX idx_dokumen_pendaftaran_verified_by ON dokumen_pendaftaran (verified_by);

CREATE TABLE data_pendaftaran (
  pendaftaran_id SERIAL PRIMARY KEY,
  siswa_id INTEGER REFERENCES siswa(siswa_id),
  orang_tua_id INTEGER REFERENCES orang_tua(user_id),
  dokumen_id INTEGER REFERENCES dokumen_pendaftaran(dokumen_id),
  id_tahunajaran INTEGER REFERENCES tahun_ajaran(id_tahunajaran),
  program_id INTEGER REFERENCES program_sekolah(program_id),
  tanggal_daftar TIMESTAMP NOT NULL,
  status_pendaftaran VARCHAR(20) DEFAULT 'proses',
  catatan TEXT
);

CREATE INDEX idx_data_pendaftaran_siswa_id ON data_pendaftaran (siswa_id);
CREATE INDEX idx_data_pendaftaran_orang_tua_id ON data_pendaftaran (orang_tua_id);
CREATE INDEX idx_data_pendaftaran_status_pendaftaran ON data_pendaftaran (status_pendaftaran);

CREATE TABLE tahun_ajaran (
  id_tahunajaran SERIAL PRIMARY KEY,
  tahun_ajaran VARCHAR(20) NOT NULL UNIQUE,
  tanggal_mulai DATE NOT NULL,
  tanggal_berakhir DATE NOT NULL,
  aktif BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_tahun_ajaran_aktif ON tahun_ajaran (aktif);

CREATE TABLE timeline_pendaftaran (
  timeline_id SERIAL PRIMARY KEY,
  periode_id INTEGER REFERENCES periode_pendaftaran(periode_id),
  id_tahunajaran INTEGER REFERENCES tahun_ajaran(id_tahunajaran),
  nama_kegiatan VARCHAR(100) NOT NULL,
  tanggal_mulai TIMESTAMP NOT NULL,
  tanggal_selesai TIMESTAMP NOT NULL,
  deskripsi TEXT
);

CREATE INDEX idx_timeline_pendaftaran_periode_id ON timeline_pendaftaran (periode_id);
CREATE INDEX idx_timeline_pendaftaran_id_tahunajaran ON timeline_pendaftaran (id_tahunajaran);

CREATE TABLE notifikasi (
  notif_id SERIAL PRIMARY KEY,
  penerima_id INTEGER REFERENCES users(user_id),
  judul VARCHAR(100) NOT NULL,
  isi TEXT,
  tanggal_kirim TIMESTAMP NOT NULL,
  status_baca VARCHAR(20) DEFAULT 'belum_dibaca',
  jenis_notif VARCHAR(20)
);

CREATE INDEX idx_notifikasi_penerima_id ON notifikasi (penerima_id);
CREATE INDEX idx_notifikasi_status_baca ON notifikasi (status_baca);
CREATE INDEX idx_notifikasi_jenis_notif ON notifikasi (jenis_notif);

CREATE TABLE aktivitas_log (
  log_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  aktivitas TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  ip_address VARCHAR(45)
);

CREATE INDEX idx_aktivitas_log_user_id ON aktivitas_log (user_id);
CREATE INDEX idx_aktivitas_log_timestamp ON aktivitas_log (timestamp);

CREATE TABLE backup_database (
  backup_id SERIAL PRIMARY KEY,
  nama_file VARCHAR(255) NOT NULL,
  ukuran VARCHAR(20),
  tanggal_backup TIMESTAMP NOT NULL,
  dibuat_oleh INTEGER REFERENCES users(user_id)
);

CREATE INDEX idx_backup_database_tanggal_backup ON backup_database (tanggal_backup);
CREATE INDEX idx_backup_database_dibuat_oleh ON backup_database (dibuat_oleh);
-- Insert default roles
INSERT INTO role (nama_role) VALUES 
    ('superadmin'),
    ('orang_tua'),
    ('admin_tu'),
    ('kepala_sekolah'); 