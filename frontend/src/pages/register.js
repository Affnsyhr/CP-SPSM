import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    akte: null,
    kk: null,
    rapor: null
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [parentFullName, setParentFullName] = useState("");
  const [parentNik, setParentNik] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // State untuk tracking field yang sudah diisi
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    parentFullName: false,
    parentNik: false,
    address: false,
    phone: false
  });

  // State untuk tracking error status setiap field
  const [fieldErrors, setFieldErrors] = useState({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
    parentFullName: null,
    parentNik: null,
    address: null,
    phone: null
  });

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

  // Fungsi validasi
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'username':
        if (!value.trim()) {
          return 'Username wajib diisi';
        }
        if (value.length < 3) {
          return 'Username minimal 3 karakter';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username hanya boleh berisi huruf, angka, dan underscore';
        }
        return null;

      case 'email':
        if (!value.trim()) {
          return 'Email wajib diisi';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format email tidak valid';
        }
        return null;

      case 'password':
        if (!value) {
          return 'Password wajib diisi';
        }
        if (value.length < 6) {
          return 'Password minimal 6 karakter';
        }
        return null;

      case 'confirmPassword':
        if (!value) {
          return 'Konfirmasi password wajib diisi';
        }
        if (value !== password) {
          return 'Konfirmasi password tidak cocok';
        }
        return null;

      case 'parentFullName':
        if (!value.trim()) {
          return 'Nama lengkap wali wajib diisi';
        }
        if (value.trim().split(' ').length < 2) {
          return 'Nama lengkap minimal 2 kata';
        }
        return null;

      case 'parentNik':
        if (!value.trim()) {
          return 'NIK wali wajib diisi';
        }
        if (!/^\d{16}$/.test(value)) {
          return 'NIK harus 16 digit angka';
        }
        return null;

      case 'address':
        if (!value.trim()) {
          return 'Alamat wajib diisi';
        }
        if (value.trim().length < 10) {
          return 'Alamat terlalu pendek, minimal 10 karakter';
        }
        return null;

      case 'phone':
        if (!value.trim()) {
          return 'Nomor telepon wajib diisi';
        }
        // Format nomor Indonesia: +62 atau 08 atau 628
        if (!/^(\+62|62|08)\d{8,11}$/.test(value.replace(/\s/g, ''))) {
          return 'Format nomor telepon tidak valid (contoh: +62 812 3456 7890)';
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
  const handleFieldChange = (fieldName, value, setter) => {
    setter(value);
    
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

  useEffect(() => {
    // Simulasi pengecekan periode pendaftaran
    const checkRegistrationPeriod = async () => {
      try {
        // Ganti dengan API call sebenarnya
        const response = {
          isOpen: true,
          period: {
            name: "Pendaftaran Tahun Ajaran 2024/2025",
            startDate: "2024-01-01",
            endDate: "2024-03-31",
            academicYear: "2024/2025"
          }
        };

        setIsRegistrationOpen(response.isOpen);
        setCurrentPeriod(response.period);
      } catch (error) {
        console.error("Error checking registration period:", error);
        setIsRegistrationOpen(false);
      }
    };

    checkRegistrationPeriod();
  }, []);

  // Validasi ulang konfirmasi password ketika password berubah
  useEffect(() => {
    if (touchedFields.confirmPassword && confirmPassword) {
      const error = validateField('confirmPassword', confirmPassword);
      setFieldErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  }, [password, confirmPassword, touchedFields.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi semua field sebelum submit
    const fieldsToValidate = [
      { name: 'username', value: username },
      { name: 'email', value: email },
      { name: 'password', value: password },
      { name: 'confirmPassword', value: confirmPassword },
      { name: 'parentFullName', value: parentFullName },
      { name: 'parentNik', value: parentNik },
      { name: 'address', value: address },
      { name: 'phone', value: phone }
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

    if (password !== confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        username,
        email,
        password,
        nama_lengkap: parentFullName,
        nik: parentNik,
        alamat: address,
        no_hp: phone,
        role: 2
      };
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.status === "success") {
        toast({
          title: "Pendaftaran berhasil",
          description: "Silakan cek email untuk verifikasi.",
        });
        navigate("/register/success");
        return;
      } else {
        toast({
          title: "Pendaftaran gagal",
          description: data.message || "Terjadi kesalahan saat mendaftar",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Pendaftaran gagal",
        description: "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRegistrationOpen) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Pendaftaran Ditutup</h1>
            <p className="text-muted-foreground">
              Mohon maaf, pendaftaran siswa baru saat ini sedang ditutup.
            </p>
            {currentPeriod && (
              <div className="mt-4 rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Informasi Periode Pendaftaran</h2>
                <p className="text-sm text-muted-foreground">
                  Periode: {currentPeriod.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tanggal: {new Date(currentPeriod.startDate).toLocaleDateString('id-ID')} - {new Date(currentPeriod.endDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            )}
          </div>
          <Button asChild>
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 bg-muted">
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Daftar Sekarang</h1>
              <p className="text-muted-foreground">
                Buat akun untuk memulai proses pendaftaran siswa madrasah secara online.
              </p>
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-lg">
              <img 
                src="/Logo3.png" 
                alt="Ilustrasi Pendaftaran" 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                "Pendidikan adalah kunci untuk membuka pintu masa depan yang cerah."
              </p>
              <p className="text-sm font-medium">- Tim Madrasah</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex h-full flex-col justify-between p-8">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Kembali ke Beranda
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sudah punya akun?</span>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Masuk
              </Link>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Daftar</h1>
              <p className="text-sm text-muted-foreground">
                {step === 1 ? "Lengkapi informasi akun Anda" : "Lengkapi informasi pribadi Anda"}
              </p>
            </div>
            <div className="flex justify-between">
              <div className={`flex-1 h-2 rounded-l-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
              <div className={`flex-1 h-2 rounded-r-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={e => handleFieldChange('username', e.target.value, setUsername)}
                  placeholder="Username unik"
                  required
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('username', username)}
                  className={getInputClassName('username')}
                />
                <HelperText text="Minimal 3 karakter, hanya huruf, angka, dan underscore" />
                <ErrorMessage fieldName="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => handleFieldChange('email', e.target.value, setEmail)}
                  placeholder="nama@contoh.com"
                  required
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('email', email)}
                  className={getInputClassName('email')}
                />
                <ErrorMessage fieldName="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => handleFieldChange('password', e.target.value, setPassword)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    onBlur={() => handleFieldBlur('password', password)}
                    className={getInputClassName('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                    <span className="sr-only">{showPassword ? "Sembunyikan password" : "Tampilkan password"}</span>
                  </Button>
                </div>
                <HelperText text="Minimal 6 karakter" />
                <ErrorMessage fieldName="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    onBlur={() => handleFieldBlur('confirmPassword', confirmPassword)}
                    className={getInputClassName('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                    </span>
                  </Button>
                </div>
                <ErrorMessage fieldName="confirmPassword" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-full-name">Nama Lengkap Wali</Label>
                <Input
                  id="parent-full-name"
                  value={parentFullName}
                  onChange={e => handleFieldChange('parentFullName', e.target.value, setParentFullName)}
                  placeholder="Masukkan nama lengkap wali"
                  required
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('parentFullName', parentFullName)}
                  className={getInputClassName('parentFullName')}
                />
                <HelperText text="Minimal 2 kata (nama depan dan belakang)" />
                <ErrorMessage fieldName="parentFullName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-nik">NIK Wali Siswa</Label>
                <Input
                  id="parent-nik"
                  value={parentNik}
                  onChange={e => handleFieldChange('parentNik', e.target.value, setParentNik)}
                  placeholder="Masukkan NIK wali siswa"
                  required
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('parentNik', parentNik)}
                  className={getInputClassName('parentNik')}
                />
                <HelperText text="16 digit angka NIK" />
                <ErrorMessage fieldName="parentNik" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={e => handleFieldChange('address', e.target.value, setAddress)}
                  placeholder="Alamat lengkap"
                  required
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('address', address)}
                  className={getInputClassName('address')}
                />
                <HelperText text="Minimal 10 karakter" />
                <ErrorMessage fieldName="address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => handleFieldChange('phone', e.target.value, setPhone)}
                  placeholder="+62 812 3456 7890"
                  required
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('phone', phone)}
                  className={getInputClassName('phone')}
                />
                <HelperText text="Format: +62 812 3456 7890 atau 0812 3456 7890" />
                <ErrorMessage fieldName="phone" />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </form>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Madrasah. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}