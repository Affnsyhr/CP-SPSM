import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin", // default role
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulasi login dengan kredensial yang berbeda
      if (formData.role === "headmaster" && 
          formData.email === "headmaster@madrasah.id" && 
          formData.password === "headmaster123") {
        // Login sebagai kepala sekolah
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          name: "Kepala Sekolah",
          email: formData.email,
          role: "headmaster"
        }));
        
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di dashboard kepala sekolah",
        });
        
        navigate("/dashboard"); // Menggunakan path yang sama seperti admin
      } else if (formData.role === "admin" && 
                 formData.email === "admin@madrasah.id" && 
                 formData.password === "admin123") {
        // Login sebagai admin
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          name: "Admin",
          email: formData.email,
          role: "admin"
        }));
        
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di dashboard admin",
        });
        
        navigate("/dashboard");
      } else if (formData.role === "superadmin" && 
                 formData.email === "superadmin@madrasah.id" && 
                 formData.password === "superadmin123") {
        // Login sebagai superadmin
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          name: "Super Admin",
          email: formData.email,
          role: "superadmin"
        }));
        
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di dashboard super admin",
        });
        
        navigate("/dashboard");
      } else {
        throw new Error("Email atau password salah");
      }
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error.message,
        variant: "destructive",
      });
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
            Masuk ke dashboard admin atau kepala sekolah
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Login Sebagai
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="headmaster">Kepala Sekolah</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
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
                placeholder="Email"
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
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 