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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);

    // Simulasi register API call
    try {
      // Ganti dengan API call sebenarnya
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulasi berhasil register
      toast({
        title: "Pendaftaran berhasil",
        description: "Silakan cek email Anda untuk verifikasi akun",
      });

      // Redirect ke halaman sukses
      navigate("/register/success");
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
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="nama@contoh.com" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Daftar Sebagai</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="wali"
                    >
                      <option value="wali">Wali Murid</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="student-full-name">Nama Lengkap Siswa</Label>
                    <Input id="student-full-name" placeholder="Masukkan nama lengkap siswa" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" type="tel" placeholder="+62 812 3456 7890" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input id="address" placeholder="Alamat lengkap" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" placeholder="Kota" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input id="province" placeholder="Provinsi" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-full-name">Nama Lengkap Wali</Label>
                    <Input id="parent-full-name" placeholder="Masukkan nama lengkap wali" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program Sekolah</Label>
                    <select
                      id="program"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Pilih Program</option>
                      <option value="boarding">Boarding School</option>
                      <option value="full-day">Full Day School</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jalur">Jalur Pendaftaran</Label>
                    <select
                      id="jalur"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Pilih Jalur Pendaftaran</option>
                      <option value="reguler">Reguler</option>
                      <option value="prestasi-akademik">Prestasi Akademik</option>
                      <option value="prestasi-non-akademik">Prestasi Non Akademik</option>
                      <option value="tahfizh">Tahfizh</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="akte">Akte Kelahiran (PDF)</Label>
                      <Input
                        id="akte"
                        type="file"
                        accept=".pdf"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        required
                        disabled={isLoading}
                      />
                      <p className="text-sm text-muted-foreground">Format: PDF, Maksimal 2MB</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kk">Kartu Keluarga (PDF)</Label>
                      <Input
                        id="kk"
                        type="file"
                        accept=".pdf"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        required
                        disabled={isLoading}
                      />
                      <p className="text-sm text-muted-foreground">Format: PDF, Maksimal 2MB</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rapor">Rapor (PDF)</Label>
                      <Input
                        id="rapor"
                        type="file"
                        accept=".pdf"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        required
                        disabled={isLoading}
                      />
                      <p className="text-sm text-muted-foreground">Format: PDF, Maksimal 2MB</p>
                    </div>
                  </div>
                </>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : step === 1 ? "Lanjutkan" : "Daftar"}
              </Button>
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Kembali
                </Button>
              )}
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