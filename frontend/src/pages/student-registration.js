import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

export default function StudentRegistrationPage() {
  const [student, setStudent] = useState({
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    alamat: ""
  });
  const [documents, setDocuments] = useState({
    akte: null,
    kk: null,
    rapor: null,
  });
  const [programId, setProgramId] = useState("");
  const [tahunAjaranId, setTahunAjaranId] = useState("");
  const [jalur, setJalur] = useState("");
  const [catatan, setCatatan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk tracking field yang sudah disentuh
  const [touchedFields, setTouchedFields] = useState({
    nama_lengkap: false,
    tempat_lahir: false,
    tanggal_lahir: false,
    alamat: false,
    programId: false,
    tahunAjaranId: false,
    jalur: false,
    akte: false,
    kk: false,
    rapor: false
  });
  
  // State untuk tracking error status setiap field
  const [fieldErrors, setFieldErrors] = useState({
    nama_lengkap: null,
    tempat_lahir: null,
    tanggal_lahir: null,
    alamat: null,
    programId: null,
    tahunAjaranId: null,
    jalur: null,
    akte: null,
    kk: null,
    rapor: null
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tahunAjaranOptions, setTahunAjaranOptions] = useState([]);
  const [sudahAdaSiswa, setSudahAdaSiswa] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);
  const [jalurOptions, setJalurOptions] = useState([]);

  // Fungsi validasi field
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'nama_lengkap':
        if (!value.trim()) {
          return 'Nama lengkap siswa wajib diisi';
        }
        if (value.trim().split(' ').length < 2) {
          return 'Nama lengkap minimal 2 kata';
        }
        if (value.trim().length < 3) {
          return 'Nama lengkap terlalu pendek';
        }
        return null;

      case 'tempat_lahir':
        if (!value.trim()) {
          return 'Tempat lahir wajib diisi';
        }
        if (value.trim().length < 2) {
          return 'Tempat lahir terlalu pendek';
        }
        return null;

      case 'tanggal_lahir':
        if (!value) {
          return 'Tanggal lahir wajib diisi';
        }
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 4 || age > 18) {
          return 'Usia siswa harus antara 4-18 tahun';
        }
        return null;

      case 'alamat':
        if (!value.trim()) {
          return 'Alamat wajib diisi';
        }
        if (value.trim().length < 10) {
          return 'Alamat terlalu pendek, minimal 10 karakter';
        }
        return null;

      case 'programId':
        if (!value) {
          return 'Program sekolah wajib dipilih';
        }
        return null;

      case 'tahunAjaranId':
        if (!value) {
          return 'Tahun ajaran wajib dipilih';
        }
        return null;

      case 'jalur':
        if (!value) {
          return 'Jalur pendaftaran wajib dipilih';
        }
        return null;

      case 'akte':
        if (!value) {
          return 'Akte kelahiran wajib diupload';
        }
        if (value && !value.name.toLowerCase().endsWith('.pdf')) {
          return 'Akte kelahiran harus dalam format PDF';
        }
        return null;

      case 'kk':
        if (!value) {
          return 'Kartu keluarga wajib diupload';
        }
        if (value && !value.name.toLowerCase().endsWith('.pdf')) {
          return 'Kartu keluarga harus dalam format PDF';
        }
        return null;

      case 'rapor':
        if (!value) {
          return 'Rapor wajib diupload';
        }
        if (value && !value.name.toLowerCase().endsWith('.pdf')) {
          return 'Rapor harus dalam format PDF';
        }
        return null;

      default:
        return null;
    }
  };

  // Handler untuk field blur (saat user selesai mengetik)
  const handleFieldBlur = (fieldName, value) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    
    if (error) {
      toast({
        title: "Kesalahan Pengisian",
        description: error,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Handler untuk validasi real-time saat mengetik
  const handleFieldChange = (fieldName, value) => {
    // Update state berdasarkan field
    if (fieldName === 'programId') {
      setProgramId(value);
    } else if (fieldName === 'tahunAjaranId') {
      setTahunAjaranId(value);
    } else if (fieldName === 'jalur') {
      setJalur(value);
    } else if (fieldName === 'catatan') {
      setCatatan(value);
    } else {
      setStudent(prev => ({ ...prev, [fieldName]: value }));
    }
    
    // Hanya validasi jika field sudah pernah disentuh
    if (touchedFields[fieldName]) {
      const error = validateField(fieldName, value);
      setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
      
      if (error) {
        toast({
          title: "Kesalahan Pengisian",
          description: error,
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  // Fungsi untuk mendapatkan class CSS berdasarkan error status
  const getInputClassName = (fieldName) => {
    const baseClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-500 focus-visible:ring-red-500`;
    }
    
    return baseClass;
  };

  // Komponen untuk menampilkan error message
  const ErrorMessage = ({ fieldName }) => {
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return (
        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
          {fieldErrors[fieldName]}
        </p>
      );
    }
    return null;
  };

  // Komponen untuk menampilkan helper text
  const HelperText = ({ text, className = "" }) => {
    if (!text) return null;
    return (
      <p className={`text-xs text-muted-foreground mt-1 ${className}`}>
        {text}
      </p>
    );
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
    
    // Validasi real-time jika field sudah pernah disentuh
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
      
      if (error) {
        toast({
          title: "Kesalahan Pengisian",
          description: error,
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setDocuments({ ...documents, [name]: file });
    
    // Validasi real-time jika field sudah pernah disentuh
    if (touchedFields[name]) {
      const error = validateField(name, file);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
      
      if (error) {
        toast({
          title: "Kesalahan Pengisian",
          description: error,
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  const getToken = () => {
    return localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);
  };

  // Filter jalur sesuai program yang dipilih
  const filteredJalurOptions = jalurOptions.filter(j => String(j.program_id) === String(programId));

  // Cari program_jalur_id berdasarkan programId dan jalur
  const getProgramJalurId = () => {
    const found = jalurOptions.find(j => String(j.program_id) === String(programId) && j.jenis_pendaftar === jalur);
    return found ? found.id : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Tampilkan toast loading
    toast({
      title: "Memproses Pendaftaran",
      description: "Mohon tunggu sebentar...",
      duration: 2000,
    });

    try {
      // Validasi semua field sebelum submit
      const fieldsToValidate = [
        { name: 'nama_lengkap', value: student.nama_lengkap },
        { name: 'tempat_lahir', value: student.tempat_lahir },
        { name: 'tanggal_lahir', value: student.tanggal_lahir },
        { name: 'alamat', value: student.alamat },
        { name: 'programId', value: programId },
        { name: 'tahunAjaranId', value: tahunAjaranId },
        { name: 'jalur', value: jalur },
        { name: 'akte', value: documents.akte },
        { name: 'kk', value: documents.kk },
        { name: 'rapor', value: documents.rapor }
      ];

      let hasErrors = false;
      
      for (const field of fieldsToValidate) {
        const error = validateField(field.name, field.value);
        if (error) {
          toast({
            title: "Kesalahan Pengisian",
            description: error,
            variant: "destructive",
            duration: 4000,
          });
          hasErrors = true;
          break; // Hentikan loop setelah error pertama
        }
      }

      if (hasErrors) {
        return;
      }

      // 1. Tambah siswa
      const resSiswa = await fetch("/api/siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(student),
      });
      const dataSiswa = await resSiswa.json();
      if (!resSiswa.ok || !dataSiswa.data || !dataSiswa.data.siswa_id) {
        throw new Error(dataSiswa.message || "Gagal menambah data siswa. Silakan cek kembali.");
      }
      const siswa_id = dataSiswa.data.siswa_id;

      // 2. Submit pendaftaran (dapatkan pendaftaran_id)
      const program_jalur_id = getProgramJalurId();
      if (!program_jalur_id) {
        toast({ title: 'Jalur tidak valid', description: 'Pilih jalur yang sesuai dengan program', variant: 'destructive' });
        setIsLoading(false);
        return;
      }
      const resPendaftaran = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          siswa_id,
          program_id: programId,
          tahun_ajaran_id: tahunAjaranId,
          catatan,
          program_jalur_id
        }),
      });
      const dataPendaftaran = await resPendaftaran.json();
      if (!resPendaftaran.ok || !dataPendaftaran.data || !dataPendaftaran.data.pendaftaran_id) {
        throw new Error(dataPendaftaran.message || "Gagal mendaftarkan siswa. Silakan coba lagi.");
      }
      const pendaftaran_id = dataPendaftaran.data.pendaftaran_id;

      // 3. Upload dokumen (pakai pendaftaran_id)
      for (const [jenis, file] of Object.entries(documents)) {
        if (!file) continue;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pendaftaran_id", pendaftaran_id);
        formData.append("jenis_dokumen",
          jenis === "kk"
            ? "kartu_keluarga"
            : jenis === "akte"
            ? "akta_kelahiran"
            : "lainnya" // rapor dikirim sebagai 'lainnya'
        );
        const resDoc = await fetch("/api/dokumen", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getToken()}`
          },
          body: formData,
        });
        const dataDoc = await resDoc.json();
        if (!resDoc.ok) throw new Error(dataDoc.message || `Gagal upload dokumen ${jenis}. Silakan coba lagi.`);
      }

      toast({
        title: "Pendaftaran Berhasil",
        description: `Siswa ${student.nama_lengkap} berhasil didaftarkan.`,
      });
      navigate("/dashboard"); // atau ke halaman lain sesuai kebutuhan
    } catch (error) {
      // Tampilkan toast error dengan pesan yang spesifik
      toast({
        title: "Pendaftaran Gagal",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
      
      // Log error untuk debugging
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tahun ajaran dari backend
  useEffect(() => {
    fetch('/api/tahunajaran', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setTahunAjaranOptions(data.data);
        }
      });
  }, []);

  // Cek apakah user sudah pernah mendaftarkan siswa
  useEffect(() => {
    fetch('/api/siswa/my', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.length > 0) {
          setSudahAdaSiswa(true);
        }
      });
  }, []);

  // Fetch program dari backend
  useEffect(() => {
    fetch('/api/program', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setProgramOptions(data.data);
        }
      });
  }, []);

  // Fetch jalur pendaftaran dari backend
  useEffect(() => {
    fetch('/api/program/jalur', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setJalurOptions(data.data);
        }
      });
  }, []);

  // Ambil unique jalur dari jalurOptions
  const uniqueJalur = Array.from(
    new Set(jalurOptions.map(j => j.jenis_pendaftar))
  ).map(jenis => {
    return jalurOptions.find(j => j.jenis_pendaftar === jenis);
  });

  // Mapping label jalur
  const getJalurLabel = (value) => {
    switch (value) {
      case 'reguler': return 'Reguler';
      case 'Prestasi akademik': return 'Prestasi Akademik';
      case 'prestasi non akademik': return 'Prestasi Non Akademik';
      case 'tahfiz': return 'Tahfizh';
      default: return value;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {sudahAdaSiswa ? (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Pendaftaran Siswa</h1>
          <p className="mb-4">Anda sudah mendaftarkan siswa. Satu wali hanya boleh mendaftarkan satu siswa.</p>
          <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
        </div>
      ) : (
        <form className="w-full max-w-lg space-y-6 bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Pendaftaran Siswa Baru</h1>
          {/* Data Siswa */}
          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">Nama Lengkap Siswa</Label>
            <Input id="nama_lengkap" name="nama_lengkap" value={student.nama_lengkap} onChange={handleStudentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('nama_lengkap', student.nama_lengkap)} />
            <HelperText text="Minimal 2 kata (nama depan dan belakang)" />
            <ErrorMessage fieldName="nama_lengkap" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
            <Input id="tempat_lahir" name="tempat_lahir" value={student.tempat_lahir} onChange={handleStudentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('tempat_lahir', student.tempat_lahir)} />
            <HelperText text="Contoh: Jakarta, Bandung, Surabaya" />
            <ErrorMessage fieldName="tempat_lahir" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
            <Input id="tanggal_lahir" name="tanggal_lahir" type="date" value={student.tanggal_lahir} onChange={handleStudentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('tanggal_lahir', student.tanggal_lahir)} />
            <HelperText text="Usia siswa harus antara 4-18 tahun" />
            <ErrorMessage fieldName="tanggal_lahir" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
            <select id="jenis_kelamin" name="jenis_kelamin" value={student.jenis_kelamin} onChange={handleStudentChange} required disabled={isLoading} className="w-full border rounded p-2" onBlur={() => handleFieldBlur('jenis_kelamin', student.jenis_kelamin)}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <ErrorMessage fieldName="jenis_kelamin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input id="alamat" name="alamat" value={student.alamat} onChange={handleStudentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('alamat', student.alamat)} />
            <HelperText text="Minimal 10 karakter, alamat lengkap" />
            <ErrorMessage fieldName="alamat" />
          </div>
          {/* Upload Dokumen */}
          <div className="space-y-2">
            <Label htmlFor="akte">Akte Kelahiran (PDF)</Label>
            <Input id="akte" name="akte" type="file" accept=".pdf" onChange={handleDocumentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('akte', documents.akte)} />
            <HelperText text="Upload file PDF akte kelahiran siswa" />
            <ErrorMessage fieldName="akte" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kk">Kartu Keluarga (PDF)</Label>
            <Input id="kk" name="kk" type="file" accept=".pdf" onChange={handleDocumentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('kk', documents.kk)} />
            <HelperText text="Upload file PDF kartu keluarga" />
            <ErrorMessage fieldName="kk" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rapor">Rapor (PDF)</Label>
            <Input id="rapor" name="rapor" type="file" accept=".pdf" onChange={handleDocumentChange} required disabled={isLoading} onBlur={() => handleFieldBlur('rapor', documents.rapor)} />
            <HelperText text="Upload file PDF rapor terakhir siswa" />
            <ErrorMessage fieldName="rapor" />
          </div>
          {/* Pilihan Program, Jalur, Tahun Ajaran */}
          <div className="space-y-2">
            <Label htmlFor="program">Program Sekolah</Label>
            <select id="program" value={programId} onChange={e => handleFieldChange('programId', e.target.value)} required disabled={isLoading} className={getInputClassName('programId')} onBlur={() => handleFieldBlur('programId', programId)}>
              <option value="">Pilih Program</option>
              {programOptions.map(opt => (
                <option key={opt.program_id} value={opt.program_id}>{opt.nama_program}</option>
              ))}
            </select>
            <ErrorMessage fieldName="programId" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jalur">Jalur Pendaftaran</Label>
            <select
              id="jalur"
              name="jalur"
              value={jalur}
              onChange={e => handleFieldChange('jalur', e.target.value)}
              required
              className={getInputClassName('jalur')}
              onBlur={() => handleFieldBlur('jalur', jalur)}
              disabled={!programId || isLoading}
            >
              <option value="">Pilih Jalur</option>
              {filteredJalurOptions.map(jalurOpt => (
                <option key={jalurOpt.id} value={jalurOpt.jenis_pendaftar}>
                  {jalurOpt.jenis_pendaftar}
                </option>
              ))}
            </select>
            <ErrorMessage fieldName="jalur" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tahunajaran">Tahun Ajaran</Label>
            <select id="tahunajaran" value={tahunAjaranId} onChange={e => handleFieldChange('tahunAjaranId', e.target.value)} required disabled={isLoading} className={getInputClassName('tahunAjaranId')} onBlur={() => handleFieldBlur('tahunAjaranId', tahunAjaranId)}>
              <option value="">Pilih Tahun Ajaran</option>
              {tahunAjaranOptions.map(opt => (
                <option key={opt.id_tahunajaran} value={opt.id_tahunajaran}>{opt.tahun_ajaran}</option>
              ))}
            </select>
            <ErrorMessage fieldName="tahunAjaranId" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="catatan">Catatan (opsional)</Label>
            <Input id="catatan" value={catatan} onChange={e => handleFieldChange('catatan', e.target.value)} disabled={isLoading} />
            <ErrorMessage fieldName="catatan" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Daftarkan Siswa"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate('/dashboard')}
            disabled={isLoading}
          >
            Kembali
          </Button>
        </form>
      )}
    </div>
  );
} 