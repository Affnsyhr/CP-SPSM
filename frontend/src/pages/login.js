import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("login"); // login, request-otp, verify-otp, new-password
  
  // State untuk tracking field yang sudah disentuh
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false
  });
  
  // State untuk tracking error status setiap field
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fungsi validasi field
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          return 'Email wajib diisi';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format email tidak valid';
        }
        return null;

      case 'password':
        if (!value.trim()) {
          return 'Password wajib diisi';
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
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Tampilkan toast loading
    toast({
      title: "Memproses Login",
      description: "Mohon tunggu sebentar...",
      duration: 2000,
    });

    try {
      // Validasi input sebelum kirim ke server
      if (!formData.email.trim()) {
        throw new Error("Email wajib diisi");
      }
      
      if (!formData.password.trim()) {
        throw new Error("Password wajib diisi");
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Format email tidak valid");
      }

      // Debug: Log URL API
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/auth/login`;
      console.log('API URL:', apiUrl);
      console.log('Form Data:', formData);

      // Panggil API login ke Backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Coba parse response JSON
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error("Terjadi kesalahan saat memproses response dari server");
      }

      if (!response.ok) {
        // Handle berbagai jenis error dari backend
        let errorMessage = "Login gagal";
        
        console.log('Error response status:', response.status);
        console.log('Error data:', data);
        
        if (response.status === 400) {
          errorMessage = data.message || "Email atau password salah. Silakan cek kembali.";
        } else if (response.status === 401) {
          errorMessage = "Email atau password salah. Pastikan data yang dimasukkan benar.";
        } else if (response.status === 404) {
          errorMessage = "Akun tidak ditemukan. Pastikan email sudah terdaftar.";
        } else if (response.status === 422) {
          errorMessage = data.message || "Data tidak valid. Silakan cek format input.";
        } else if (response.status === 500) {
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
        } else {
          errorMessage = data.message || "Terjadi kesalahan saat login. Silakan coba lagi.";
        }

        console.log('Throwing error:', errorMessage);
        throw new Error(errorMessage);
      }

      // Login berhasil
      console.log('Login successful, data:', data);
      
      // Ambil user dan token dari data.data
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);
      console.log('User after login:', data.data.user);
      
      // Tampilkan toast sukses
      toast({
        title: 'Login Berhasil',
        description: `Selamat datang, ${data.data.user.nama_lengkap || data.data.user.username}!`,
      });

      // Redirect berdasarkan role
      switch (data.data.user.role) {
        case 'admin':
          console.log('Redirecting to /admin/dashboard');
          navigate('/admin/dashboard');
          break;
        case 'superadmin':
          console.log('Redirecting to /super-admin/dashboard');
          navigate('/super-admin/dashboard');
          break;
        case 'headmaster':
          console.log('Redirecting to /headmaster/dashboard');
          navigate('/headmaster/dashboard');
          break;
        case 'kepala_sekolah':
          console.log('Redirecting to /headmaster/dashboard');
          navigate('/headmaster/dashboard');
          break;
        case 'admin_tu':
          console.log('Redirecting to /admin/dashboard');
          navigate('/admin/dashboard');
          break;
        case 'orang_tua':
          console.log('Redirecting to /dashboard');
          navigate('/dashboard');
          break;
        default:
          console.log('Redirecting to /login');
          navigate('/login');
      }

    } catch (error) {
      // Tampilkan toast error dengan pesan yang spesifik
      console.error('Login error caught:', error);
      console.error('Error message:', error.message);
      
      toast({
        title: 'Login Gagal',
        description: error.message,
        variant: 'destructive',
        duration: 4000,
      });
      
      // Log error untuk debugging
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulasi API call untuk mengirim OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulasi OTP yang dikirim (dalam implementasi nyata, ini akan datang dari backend)
      const generatedOTP = "123456"; // OTP statis untuk testing
      
      // Simpan OTP ke localStorage untuk testing
      localStorage.setItem("tempOTP", generatedOTP);

      toast({
        title: "OTP Terkirim",
        description: `Kode OTP telah dikirim ke email Anda. Kode OTP: ${generatedOTP}`,
      });

      setStep("verify-otp");
    } catch (error) {
      toast({
        title: "Gagal Mengirim OTP",
        description: "Terjadi kesalahan saat mengirim kode OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ambil OTP dari localStorage
      const storedOTP = localStorage.getItem("tempOTP");

      // Verifikasi OTP
      if (otp === storedOTP) {
        setStep("new-password");
        toast({
          title: "OTP Valid",
          description: "Silakan buat password baru",
        });
      } else {
        throw new Error("Kode OTP tidak valid");
      }
    } catch (error) {
      toast({
        title: "Verifikasi Gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Password tidak cocok");
      }

      // Simulasi API call untuk reset password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password Berhasil Diubah",
        description: "Silakan login dengan password baru Anda",
      });

      // Reset semua state dan kembali ke form login
      setStep("login");
      setResetEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Gagal Mengubah Password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForgotPasswordForm = () => {
    switch (step) {
      case "request-otp":
        return (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="nama@contoh.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Kirim Kode OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep("login")}
              disabled={isLoading}
            >
              Kembali ke Login
            </Button>
          </form>
        );

      case "verify-otp":
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Kode OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Masukkan 6 digit kode OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep("request-otp")}
              disabled={isLoading}
            >
              Kirim Ulang OTP
            </Button>
          </form>
        );

      case "new-password":
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Ubah Password"}
            </Button>
          </form>
        );

      default:
        return null;
    }
  };

  const determineUserRole = (email) => {
    if (email.includes("admin")) {
      return "admin";
    } else if (email.includes("super")) {
      return "super_admin";
    } else if (email.includes("headmaster")) {
      return "headmaster";
    }
    return "wali";
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 bg-muted">
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <img
                src="/Logo.png"
                alt="Logo Madrasah"
                className="mx-auto h-32 w-32 object-contain"
              />
              <h1 className="text-3xl font-bold">Selamat Datang Kembali</h1>
              <p className="text-muted-foreground">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-lg">
              <img
                src="/Logo2.png"
                alt="Ilustrasi Login"
                className="h-full w-full object-cover"
              />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">
                {step === "login" ? "Masuk" : "Lupa Password"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === "login"
                  ? "Masukkan email dan password Anda"
                  : step === "request-otp"
                  ? "Masukkan email Anda untuk menerima kode OTP"
                  : step === "verify-otp"
                  ? "Masukkan kode OTP yang telah dikirim ke email Anda"
                  : "Buat password baru untuk akun Anda"}
              </p>
            </div>

            {step === "login" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@contoh.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    required
                    disabled={isLoading}
                    className={getInputClassName('email')}
                  />
                  <HelperText text="Masukkan email yang sudah terdaftar" />
                  <ErrorMessage fieldName="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={(e) => handleFieldBlur('password', e.target.value)}
                    required
                    disabled={isLoading}
                    className={getInputClassName('password')}
                  />
                  <ErrorMessage fieldName="password" />
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={() => setStep("request-otp")}
                >
                  Lupa password?
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            ) : (
              renderForgotPasswordForm()
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Belum punya akun?{" "}
              </span>
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Daftar
              </Link>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Madrasah. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}