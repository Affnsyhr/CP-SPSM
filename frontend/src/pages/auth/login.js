import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import apiService from "../../services/api";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await apiService.login(formData);

      if (data.status === 'success') {
        // Simpan token dan data user
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${data.data.user.nama_lengkap || data.data.user.username}!`,
        });

        // Redirect berdasarkan role
        const role = data.data.user.role;
        if (role === 'superadmin') {
          navigate("/super-admin/dashboard");
        } else if (role === 'admin') {
          navigate("/admin/dashboard");
        } else if (role === 'headmaster') {
          navigate("/headmaster/dashboard");
        } else if (role === 'orang_tua') {
          navigate("/wali-siswa/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login ke Akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk ke sistem pendaftaran siswa
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Masukkan email Anda"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Masukkan password Anda"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </div>
          
          <div className="text-center">
            <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500">
              Belum punya akun? Daftar disini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 