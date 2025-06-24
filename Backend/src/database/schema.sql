-- Table: role
CREATE TABLE role (
  role_id SERIAL PRIMARY KEY,
  nama_role VARCHAR(20) NOT NULL UNIQUE,
  deskripsi TEXT
);
COMMENT ON COLUMN role.nama_role IS 'orang_tua';

-- Table: users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP,
  role_id INTEGER NOT NULL REFERENCES role(role_id)
);
COMMENT ON COLUMN users.role_id IS 'orang_tua';

-- Table: user_profile
CREATE TABLE orang_tua (
  user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
  nama_lengkap VARCHAR(100) NOT NULL,
  nik VARCHAR(20) UNIQUE,
  alamat TEXT,
  no_hp VARCHAR(15)
);

-- Table: siswa
CREATE TYPE jenis_kelamin_enum AS ENUM ('L', 'P');
CREATE TABLE siswa (
  siswa_id SERIAL PRIMARY KEY,
  orang_tua_id INTEGER REFERENCES user_profile(user_id),
  nama_lengkap VARCHAR(100) NOT NULL,
  tempat_lahir VARCHAR(50),
  tanggal_lahir DATE,
  jenis_kelamin jenis_kelamin_enum NOT NULL,
  created_at TIMESTAMP NOT NULL
);

-- Table: program_sekolah
CREATE TYPE nama_program_enum AS ENUM ('boarding School', 'Full day school');
CREATE TYPE status_program_enum AS ENUM ('aktif', 'nonaktif');
CREATE TYPE jenis_pendaftar_enum AS ENUM ('reguler','Prestasi akademik','prestasi non akademik','tahfiz');
CREATE TABLE program_sekolah (
  program_id SERIAL PRIMARY KEY,
  nama_program nama_program_enum NOT NULL,
  deskripsi TEXT,
  status_program status_program_enum DEFAULT 'aktif',
  kuota_siswa INTEGER,
  jenis_pendaftar jenis_pendaftar_enum DEFAULT 'reguler' NOT NULL
);
COMMENT ON COLUMN program_sekolah.nama_program IS 'Program khusus madrasah SMP';
COMMENT ON COLUMN program_sekolah.kuota_siswa IS 'Jumlah maksimal siswa per angkatan';
COMMENT ON COLUMN program_sekolah.jenis_pendaftar IS 'Jenis pendaftar yang diterima program';

-- -- Table: periode_pendaftaran
-- CREATE TYPE status_periode_enum AS ENUM ('aktif', 'nonaktif');
-- CREATE TABLE periode_pendaftaran (
--   periode_id SERIAL PRIMARY KEY,
--   nama_periode VARCHAR(50) NOT NULL,
--   tanggal_mulai DATE NOT NULL,
--   tanggal_berakhir DATE NOT NULL,
--   status status_periode_enum DEFAULT 'nonaktif',
--   created_by INTEGER REFERENCES users(user_id)
-- );

-- Table: dokumen_pendaftaran
CREATE TYPE jenis_dokumen_enum AS ENUM ('akta_kelahiran', 'kartu_keluarga', 'ijazah', 'foto', 'lainnya');
CREATE TYPE status_verifikasi_enum AS ENUM ('menunggu', 'diterima', 'ditolak');
CREATE TABLE dokumen_pendaftaran (
  dokumen_id SERIAL PRIMARY KEY,
  siswa_id INTEGER REFERENCES siswa(siswa_id),
  jenis_dokumen jenis_dokumen_enum NOT NULL,
  nama_file VARCHAR(255),
  status_verifikasi status_verifikasi_enum DEFAULT 'menunggu',
  tanggal_upload TIMESTAMP,
  tanggal_verifikasi TIMESTAMP,
  verified_by INTEGER REFERENCES users(user_id),
  catatan TEXT
);

-- Table: data_pendaftaran
CREATE TYPE status_pendaftaran_enum AS ENUM ('proses', 'lulus', 'tidak_lulus', 'cadangan');
CREATE TABLE data_pendaftaran (
  pendaftaran_id SERIAL PRIMARY KEY,
  siswa_id INTEGER REFERENCES siswa(siswa_id),
  orang_tua_id INTEGER REFERENCES user_profile(user_id),
  dokumen_id INTEGER REFERENCES dokumen_pendaftaran(dokumen_id),
  id_tahunajaran INTEGER REFERENCES tahun_ajaran(id_tahunajaran),
  program_id INTEGER REFERENCES program_sekolah(program_id),
  tanggal_daftar TIMESTAMP NOT NULL,
  status_pendaftaran status_pendaftaran_enum DEFAULT 'proses',
  catatan TEXT
);

-- Table: tahun_ajaran
CREATE TABLE tahun_ajaran (
  id_tahunajaran SERIAL PRIMARY KEY,
  tahun_ajaran VARCHAR(20) NOT NULL UNIQUE,
  tanggal_mulai DATE NOT NULL,
  tanggal_berakhir DATE NOT NULL,
  status status_tahun_ajaran_enum DEFAULT 'persiapan',
  created_by INTEGER REFERENCES users(user_id)
);

COMMENT ON COLUMN tahun_ajaran.tahun_ajaran IS 'Format tahun ajaran seperti "2025/2026" atau "2025-2026"';
COMMENT ON COLUMN tahun_ajaran.tanggal_mulai IS 'Tanggal mulai tahun ajaran';
COMMENT ON COLUMN tahun_ajaran.tanggal_berakhir IS 'Tanggal berakhir tahun ajaran';

-- Table: timeline_pendaftaran
CREATE TABLE timeline_pendaftaran (
  timeline_id SERIAL PRIMARY KEY,
  id_tahunajaran INTEGER REFERENCES tahun_ajaran(id_tahunajaran),
  nama_kegiatan VARCHAR(100) NOT NULL,
  tanggal_mulai TIMESTAMP NOT NULL,
  tanggal_selesai TIMESTAMP NOT NULL
);

-- Table: notifikasi
CREATE TYPE status_baca_enum AS ENUM ('terbaca', 'belum_dibaca');
CREATE TYPE jenis_notif_enum AS ENUM ('kelulusan', 'dokumen', 'sistem', 'pembayaran');
CREATE TABLE notifikasi (
  notif_id SERIAL PRIMARY KEY,
  penerima_id INTEGER REFERENCES users(user_id),
  judul VARCHAR(100) NOT NULL,
  isi TEXT,
  tanggal_kirim TIMESTAMP NOT NULL,
  status_baca status_baca_enum DEFAULT 'belum_dibaca',
  jenis_notif jenis_notif_enum
);

-- Table: aktivitas_log
CREATE TABLE aktivitas_log (
  log_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  aktivitas TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  ip_address VARCHAR(45)
);

-- Table: backup_database
CREATE TABLE backup_database (
  backup_id SERIAL PRIMARY KEY,
  nama_file VARCHAR(255) NOT NULL,
  ukuran VARCHAR(20),
  tanggal_backup TIMESTAMP NOT NULL,
  dibuat_oleh INTEGER REFERENCES users(user_id)
);