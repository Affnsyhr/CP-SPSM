import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { Sidebar, waliMenu } from "../../components/layout/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../components/ui/dialog";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({
    jumlahAnak: 0,
    statusPendaftaran: '-',
    dokumenTerverifikasi: 0,
    totalDokumen: 0,
    jumlahNotifikasi: 0
  });
  const [showNotif, setShowNotif] = useState(false);
  const dropdownNotifRef = useRef(null);
  const [notifikasi, setNotifikasi] = useState([]);

  // Ambil data user dari localStorage saat komponen dimount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    } else {
      // Jika tidak ada data user, redirect ke login
      navigate('/login');
    }
  }, [navigate]);

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

  // Tutup dropdown notifikasi jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownNotifRef.current && !dropdownNotifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotif]);

  const handleLogout = () => {
    // Hapus data user dan token dari localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login");
  };

  // Fungsi untuk mendapatkan nama user yang akan ditampilkan
  const getUserDisplayName = () => {
    if (!userData) return "User";
    return userData.nama_lengkap || userData.username || "User";
  };

  // Fetch KPI dari backend
  const fetchKPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orangtua/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const siswa = Array.isArray(data.data.siswa) ? data.data.siswa : [];
        const pendaftaran = Array.isArray(data.data.pendaftaran) ? data.data.pendaftaran : [];
        const dokumen = Array.isArray(data.data.dokumen) ? data.data.dokumen : [];
        const notifikasi = Array.isArray(data.data.notifikasi) ? data.data.notifikasi : [];
        setNotifikasi(notifikasi);
        // Status pendaftaran terakhir (jika ada)
        let statusPendaftaran = '-';
        if (pendaftaran.length > 0) {
          statusPendaftaran = pendaftaran[0].status_pendaftaran || '-';
        }
        // Dokumen terverifikasi
        const dokumenTerverifikasi = dokumen.filter(d => d.status_verifikasi === 'terverifikasi').length;
        setKpi({
          jumlahAnak: siswa.length,
          statusPendaftaran,
          dokumenTerverifikasi,
          totalDokumen: dokumen.length,
          jumlahNotifikasi: notifikasi.length
        });
      } else {
        setNotifikasi([]);
        setKpi({ jumlahAnak: 0, statusPendaftaran: '-', dokumenTerverifikasi: 0, totalDokumen: 0, jumlahNotifikasi: 0 });
      }
    } catch (err) {
      setNotifikasi([]);
      setKpi({ jumlahAnak: 0, statusPendaftaran: '-', dokumenTerverifikasi: 0, totalDokumen: 0, jumlahNotifikasi: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPI();
  }, []);

  // Handler untuk menandai notifikasi sudah dibaca
  const handleBacaNotifikasi = async (notifikasi_id, status_baca) => {
    if (status_baca !== 'belum_dibaca') return;
    try {
      await fetch(`/api/notifikasi/${notifikasi_id}/baca`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      // Refresh notifikasi
      fetchKPI();
    } catch (err) {
      // Optional: tampilkan error
    }
  };

  // Jika belum ada data user, tampilkan loading
  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar menu={waliMenu} />
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
            <span className="text-lg font-semibold">Madrasah</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setShowNotif((prev) => !prev)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="sr-only">Notifications</span>
              {kpi.jumlahNotifikasi > 0 && (
                <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
              )}
            </Button>
            {showNotif && (
              <div
                ref={dropdownNotifRef}
                className="absolute right-0 mt-2 w-80 rounded-md border bg-white shadow-lg z-50"
                style={{ top: '3rem' }}
              >
                <div className="p-4 font-semibold border-b">Notifikasi</div>
                <ul className="max-h-64 overflow-y-auto">
                  {notifikasi.length === 0 ? (
                    <li className="p-4 text-sm text-muted-foreground">Tidak ada notifikasi baru.</li>
                  ) : (
                    notifikasi.map((notif, idx) => {
                      const notifId = notif.notif_id;
                      return (
                        <li
                          key={idx}
                          className={`p-4 border-b last:border-b-0 cursor-pointer ${notif.status_baca === 'belum_dibaca' ? 'bg-yellow-50' : ''}`}
                          onClick={() => handleBacaNotifikasi(notifId, notif.status_baca)}
                        >
                          <div className="font-medium">{notif.judul}</div>
                          <div className="text-xs text-muted-foreground whitespace-pre-line">{notif.isi}</div>
                          <div className="text-xs text-gray-400 mt-1">{notif.tanggal_kirim ? new Date(notif.tanggal_kirim).toLocaleString() : ''}</div>
                          {notif.status_baca === 'belum_dibaca' && (
                            <span className="inline-block ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded">Baru</span>
                          )}
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="hidden md:inline-flex">{getUserDisplayName()}</span>
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
                    <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                      <div className="font-medium">{getUserDisplayName()}</div>
                      <div className="text-xs">{userData.email}</div>
                    </div>
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

        <div className="flex flex-1">
          {/* Main content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Selamat datang, {getUserDisplayName()}. Berikut adalah ringkasan pendaftaran Anda.
                  </p>
                </div>
                <Link to="/student-registration">
                  <Button variant="primary">Pendaftaran Siswa Baru</Button>
                </Link>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <span className="ml-4">Memuat data KPI...</span>
                </div>
              ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Jumlah Anak</h3>
                    <p className="text-sm text-muted-foreground">Total anak yang terdaftar</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{kpi.jumlahAnak}</div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Status Pendaftaran Terakhir</h3>
                    <p className="text-sm text-muted-foreground">Status pendaftaran anak terakhir</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{kpi.statusPendaftaran}</div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Dokumen Terverifikasi</h3>
                    <p className="text-sm text-muted-foreground">Jumlah dokumen yang sudah diverifikasi</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{kpi.dokumenTerverifikasi} / {kpi.totalDokumen}</div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Notifikasi</h3>
                    <p className="text-sm text-muted-foreground">Pemberitahuan terbaru</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{kpi.jumlahNotifikasi}</div>
                    <p className="text-xs text-muted-foreground">Anda memiliki {kpi.jumlahNotifikasi} notifikasi terbaru</p>
                  </div>
                </div>
              </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}