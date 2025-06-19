-- Create role table
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    nama_role VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table
CREATE 


-- Create orang_tua table
CREATE TABLE orang_tua (
    user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    nama_lengkap VARCHAR(100) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    alamat TEXT NOT NULL,
    no_hp VARCHAR(15) NOT NULL
);

-- Create tahun_ajaran table
CREATE TABLE tahun_ajaran (
    tahun_ajaran_id SERIAL PRIMARY KEY,
    tahun_mulai INTEGER NOT NULL,
    tahun_selesai INTEGER NOT NULL,
    status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create program table
CREATE TABLE program (
    program_id SERIAL PRIMARY KEY,
    nama_program VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    kuota INTEGER NOT NULL,
    biaya DECIMAL(10,2) NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create siswa table
CREATE TABLE siswa (
    siswa_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    nama_lengkap VARCHAR(100) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    tempat_lahir VARCHAR(50) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(1) NOT NULL,
    alamat TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pendaftaran table
CREATE TABLE pendaftaran (
    pendaftaran_id SERIAL PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(siswa_id),
    tahun_ajaran_id INTEGER REFERENCES tahun_ajaran(tahun_ajaran_id),
    program_id INTEGER REFERENCES program(program_id),
    status_pendaftaran VARCHAR(20) NOT NULL DEFAULT 'pending',
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dokumen table
CREATE TABLE dokumen (
    dokumen_id SERIAL PRIMARY KEY,
    pendaftaran_id INTEGER REFERENCES pendaftaran(pendaftaran_id),
    jenis_dokumen VARCHAR(50) NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    path_file VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifikasi table
CREATE TABLE notifikasi (
    notifikasi_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    judul VARCHAR(100) NOT NULL,
    pesan TEXT NOT NULL,
    status_dibaca BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO role (nama_role) VALUES 
    ('superadmin'),
    ('orang_tua'),
    ('admin_tu'),
    ('kepala_sekolah'); 