import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { Sidebar } from "../../components/layout/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../components/ui/dialog";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPendaftar: 0,
    menungguVerifikasi: 0,
    dokumenTerverifikasi: 0,
    siswaDiterima: 0
  });

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

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch KPI data
  const fetchKPI = async () => {
    setLoading(true);
    try {
      // Fetch pendaftaran
      const pendaftaranRes = await fetch('/api/pendaftaran', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      let pendaftar = [];
      if (pendaftaranRes.ok) {
        const data = await pendaftaranRes.json();
        pendaftar = Array.isArray(data.data) ? data.data : [];
      }
      // Fetch dokumen
      const dokumenRes = await fetch('/api/dokumen/all-admin', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      let dokumen = [];
      if (dokumenRes.ok) {
        const data = await dokumenRes.json();
        dokumen = Array.isArray(data.data) ? data.data : [];
      }
      // Hitung KPI
      const totalPendaftar = pendaftar.length;
      const menungguVerifikasi = pendaftar.filter(p => p.status_pendaftaran === 'proses' || p.status_pendaftaran === 'menunggu_verifikasi').length;
      const siswaDiterima = pendaftar.filter(p => p.status_pendaftaran === 'lulus').length;
      const dokumenTerverifikasi = dokumen.filter(d => d.status_verifikasi === 'terverifikasi').length;
      setStats({ totalPendaftar, menungguVerifikasi, dokumenTerverifikasi, siswaDiterima });
    } catch (err) {
      setStats({ totalPendaftar: 0, menungguVerifikasi: 0, dokumenTerverifikasi: 0, siswaDiterima: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPI();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
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
                        setShowLogoutDialog(true);
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

        {/* Dialog Konfirmasi Logout */}
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Keluar</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin keluar?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Ya
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground">
                Selamat datang di panel admin. Berikut adalah ringkasan pendaftaran siswa.
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <span className="ml-4">Memuat data KPI...</span>
              </div>
            ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Total Pendaftar</h3>
                  <p className="text-sm text-muted-foreground">Jumlah pendaftar baru</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{stats.totalPendaftar}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Menunggu Verifikasi</h3>
                  <p className="text-sm text-muted-foreground">Pendaftar yang perlu diverifikasi</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{stats.menungguVerifikasi}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Dokumen Terverifikasi</h3>
                  <p className="text-sm text-muted-foreground">Dokumen yang sudah diverifikasi</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{stats.dokumenTerverifikasi}</div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold">Siswa Diterima</h3>
                  <p className="text-sm text-muted-foreground">Siswa yang sudah diterima</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{stats.siswaDiterima}</div>
                </div>
              </div>
            </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 