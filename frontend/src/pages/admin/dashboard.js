import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link to="/" className="hidden items-center gap-2 md:flex">
          <img
            src="/Logo.png"
            alt="Logo Madrasah"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-lg font-semibold">Madrasah - Admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="sr-only">Notifications</span>
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src="/placeholder.svg" alt="Avatar" width={24} height={24} className="rounded-full" />
              <span className="hidden md:inline-flex">Admin</span>
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
                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg">
                <div className="py-1">
                  <Link 
                    to="/admin/profile" 
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link 
                    to="/admin/settings" 
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Pengaturan
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }} 
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="grid gap-2 p-4">
            <Link to="/admin/dashboard" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/registrations" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Pendaftaran</span>
            </Link>
            <Link to="/admin/documents" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Dokumen</span>
            </Link>
            <Link to="/admin/students" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Siswa</span>
            </Link>
            <Link to="/admin/period" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary">
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
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Periode Pendaftaran
            </Link>
            <Link
              to="/admin/quota"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Kuota Siswa
            </Link>
            <Link
              to="/admin/parent-accounts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
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
                className="h-5 w-5"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Akun Wali Murid</span>
            </Link>
            <div className="mt-auto pt-4 border-t">
              <Link to="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                <span>Kembali ke Dashboard</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground">
                Selamat datang di panel admin. Berikut adalah ringkasan pendaftaran siswa.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Total Pendaftar</h3>
                  <p className="text-sm text-muted-foreground">Jumlah pendaftar baru</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">150</div>
                  <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Menunggu Verifikasi</h3>
                  <p className="text-sm text-muted-foreground">Pendaftar yang perlu diverifikasi</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">Perlu segera ditindaklanjuti</p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Dokumen Terverifikasi</h3>
                  <p className="text-sm text-muted-foreground">Dokumen yang sudah diverifikasi</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">84.7% dari total pendaftar</p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Siswa Diterima</h3>
                  <p className="text-sm text-muted-foreground">Siswa yang sudah diterima</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">98</div>
                  <p className="text-xs text-muted-foreground">65.3% dari total pendaftar</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 