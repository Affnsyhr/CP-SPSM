CREATE TYPE public.jenis_dokumen_enum AS ENUM ('akta_kelahiran', 'kartu_keluarga', 'ijazah', 'foto', 'lainnya');
CREATE TYPE public.jenis_kelamin_enum AS ENUM ('L', 'P');
CREATE TYPE public.jenis_notif_enum AS ENUM ('kelulusan', 'dokumen', 'sistem', 'pembayaran');
CREATE TYPE public.jenis_pendaftar_enum AS ENUM ('reguler', 'Prestasi akademik', 'prestasi non akademik', 'tahfiz');
CREATE TYPE public.nama_program_enum AS ENUM ('boarding School', 'Full day school');
CREATE TYPE public.status_baca_enum AS ENUM ('terbaca', 'belum_dibaca');
CREATE TYPE public.status_pendaftaran_enum AS ENUM ('proses', 'lulus', 'tidak_lulus', 'cadangan');
CREATE TYPE public.status_periode_enum AS ENUM ('aktif', 'nonaktif');
CREATE TYPE public.status_program_enum AS ENUM ('aktif', 'nonaktif');
CREATE TYPE public.status_tahun_enum AS ENUM ('aktif', 'selesai', 'persiapan');
CREATE TYPE public.status_verifikasi_enum AS ENUM ('menunggu', 'diterima', 'ditolak');

CREATE TABLE public.aktivitas_log (
    log_id integer NOT NULL,
    user_id integer,
    aktivitas text NOT NULL,
    "timestamp" timestamp NOT NULL,
    ip_address varchar(45)
);

CREATE SEQUENCE public.aktivitas_log_log_id_seq START 1;
ALTER TABLE public.aktivitas_log ALTER COLUMN log_id SET DEFAULT nextval('public.aktivitas_log_log_id_seq');

CREATE TABLE public.backup_database (
    backup_id integer NOT NULL,
    nama_file varchar(255) NOT NULL,
    ukuran varchar(20),
    tanggal_backup timestamp NOT NULL,
    dibuat_oleh integer
);

CREATE SEQUENCE public.backup_database_backup_id_seq START 1;
ALTER TABLE public.backup_database ALTER COLUMN backup_id SET DEFAULT nextval('public.backup_database_backup_id_seq');

CREATE TABLE public.data_pendaftaran (
    pendaftaran_id integer NOT NULL,
    siswa_id integer,
    orang_tua_id integer,
    dokumen_id integer,
    id_tahunajaran integer,
    program_id integer,
    tanggal_daftar timestamp NOT NULL,
    status_pendaftaran public.status_pendaftaran_enum DEFAULT 'proses',
    catatan text
);

CREATE SEQUENCE public.data_pendaftaran_pendaftaran_id_seq START 1;
ALTER TABLE public.data_pendaftaran ALTER COLUMN pendaftaran_id SET DEFAULT nextval('public.data_pendaftaran_pendaftaran_id_seq');

CREATE TABLE public.dokumen_pendaftaran (
    dokumen_id integer NOT NULL,
    siswa_id integer,
    jenis_dokumen public.jenis_dokumen_enum NOT NULL,
    nama_file varchar(255),
    status_verifikasi public.status_verifikasi_enum DEFAULT 'menunggu',
    tanggal_upload timestamp,
    tanggal_verifikasi timestamp,
    verified_by integer,
    catatan text
);

CREATE SEQUENCE public.dokumen_pendaftaran_dokumen_id_seq START 1;
ALTER TABLE public.dokumen_pendaftaran ALTER COLUMN dokumen_id SET DEFAULT nextval('public.dokumen_pendaftaran_dokumen_id_seq');

CREATE TABLE public.notifikasi (
    notif_id integer NOT NULL,
    penerima_id integer,
    judul varchar(100) NOT NULL,
    isi text,
    tanggal_kirim timestamp NOT NULL,
    status_baca public.status_baca_enum DEFAULT 'belum_dibaca',
    jenis_notif public.jenis_notif_enum
);

CREATE SEQUENCE public.notifikasi_notif_id_seq START 1;
ALTER TABLE public.notifikasi ALTER COLUMN notif_id SET DEFAULT nextval('public.notifikasi_notif_id_seq');

CREATE TABLE public.orang_tua (
    user_id integer NOT NULL,
    nama_lengkap varchar(100) NOT NULL,
    nik varchar(20),
    alamat text,
    no_hp varchar(15)
);

CREATE TABLE public.program_jalur_pendaftar (
    program_id integer NOT NULL,
    jenis_pendaftar public.jenis_pendaftar_enum NOT NULL
);

CREATE TABLE public.program_sekolah (
    program_id integer NOT NULL,
    nama_program public.nama_program_enum NOT NULL,
    deskripsi text,
    status_program public.status_program_enum DEFAULT 'aktif',
    kuota_siswa integer
);

CREATE SEQUENCE public.program_sekolah_program_id_seq START 1;
ALTER TABLE public.program_sekolah ALTER COLUMN program_id SET DEFAULT nextval('public.program_sekolah_program_id_seq');

CREATE TABLE public.role (
    role_id integer NOT NULL,
    nama_role varchar(20) NOT NULL,
    deskripsi text
);

CREATE SEQUENCE public.role_role_id_seq START 1;
ALTER TABLE public.role ALTER COLUMN role_id SET DEFAULT nextval('public.role_role_id_seq');

CREATE TABLE public.siswa (
    siswa_id integer NOT NULL,
    orang_tua_id integer,
    nama_lengkap varchar(100) NOT NULL,
    tempat_lahir varchar(50),
    tanggal_lahir date,
    jenis_kelamin public.jenis_kelamin_enum NOT NULL,
    created_at timestamp NOT NULL
);

CREATE SEQUENCE public.siswa_siswa_id_seq START 1;
ALTER TABLE public.siswa ALTER COLUMN siswa_id SET DEFAULT nextval('public.siswa_siswa_id_seq');

CREATE TABLE public.tahun_ajaran (
    id_tahunajaran integer NOT NULL,
    tahun_ajaran varchar(20) NOT NULL,
    tanggal_mulai date NOT NULL,
    tanggal_berakhir date NOT NULL,
    status public.status_tahun_enum DEFAULT 'persiapan',
    created_by integer
);

CREATE SEQUENCE public.tahun_ajaran_id_tahunajaran_seq START 1;
ALTER TABLE public.tahun_ajaran ALTER COLUMN id_tahunajaran SET DEFAULT nextval('public.tahun_ajaran_id_tahunajaran_seq');

CREATE TABLE public.timeline_pendaftaran (
    timeline_id integer NOT NULL,
    id_tahunajaran integer,
    nama_kegiatan varchar(100) NOT NULL,
    tanggal_mulai timestamp NOT NULL,
    tanggal_selesai timestamp NOT NULL,
    deskripsi text
);

CREATE SEQUENCE public.timeline_pendaftaran_timeline_id_seq START 1;
ALTER TABLE public.timeline_pendaftaran ALTER COLUMN timeline_id SET DEFAULT nextval('public.timeline_pendaftaran_timeline_id_seq');

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username varchar(50) NOT NULL,
    password_hash varchar(255) NOT NULL,
    email varchar(100) NOT NULL,
    created_at timestamp NOT NULL,
    last_login timestamp,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE public.users_user_id_seq START 1;
ALTER TABLE public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq');