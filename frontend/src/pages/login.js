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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulasi login API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulasi data user
      const userData = {
        email: formData.email,
        role: determineUserRole(formData.email),
        name: "User Name",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "super_admin":
          navigate("/super-admin/dashboard");
          break;
        case "headmaster":
          navigate("/headmaster/dashboard");
          break;
        default:
          navigate("/dashboard");
      }

      toast({
        title: "Login Berhasil",
        description: `Selamat datang di dashboard ${userData.role}`,
      });
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error.message,
        variant: "destructive",
      });
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
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
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