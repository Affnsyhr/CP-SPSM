import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { Sidebar, superAdminMenu } from "../../components/layout/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../components/ui/dialog";

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch admins count
      const adminsResponse = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch students count
      const studentsResponse = await fetch('/api/siswa', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch registrations count
      const registrationsResponse = await fetch('/api/pendaftaran', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      let adminsCount = 0;
      let studentsCount = 0;
      let registrationsCount = 0;
      let pendingRegistrationsCount = 0;

      if (adminsResponse.ok) {
        const adminsData = await adminsResponse.json();
        adminsCount = adminsData.data?.length || 0;
      }

      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        studentsCount = studentsData.data?.length || 0;
      }

      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json();
        registrationsCount = registrationsData.data?.length || 0;
        
        // Count pending registrations
        pendingRegistrationsCount = registrationsData.data?.filter(
          reg => reg.status === 'menunggu_verifikasi'
        ).length || 0;
      }

      setStats({
        totalAdmins: adminsCount,
        totalStudents: studentsCount,
        totalRegistrations: registrationsCount,
        pendingRegistrations: pendingRegistrationsCount
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar menu={superAdminMenu} />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Memuat data KPI...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar menu={superAdminMenu} />
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
            <span className="text-lg font-semibold">Madrasah - Super Admin</span>
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
                <span className="hidden md:inline-flex">Super Admin</span>
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
                      to="/super-admin/profile" 
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profil
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

        <div className="flex flex-1">
          {/* Main content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard Super Admin</h1>
                <p className="text-muted-foreground">
                  Selamat datang di panel super admin. Berikut adalah ringkasan sistem.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Total Admin</h3>
                    <p className="text-sm text-muted-foreground">Jumlah admin aktif</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                    <p className="text-xs text-muted-foreground">Admin TU & Kepala Sekolah</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Total Siswa</h3>
                    <p className="text-sm text-muted-foreground">Siswa terdaftar</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Siswa dalam sistem</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Total Pendaftaran</h3>
                    <p className="text-sm text-muted-foreground">Pendaftar dalam sistem</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
                    <p className="text-xs text-muted-foreground">Semua status pendaftaran</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Menunggu Verifikasi</h3>
                    <p className="text-sm text-muted-foreground">Pendaftar yang perlu diverifikasi</p>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{stats.pendingRegistrations}</div>
                    <p className="text-xs text-muted-foreground">Perlu tindakan admin</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link to="/super-admin/admins">
                    <Button className="w-full" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="m22 21-2-2"></path>
                        <path d="M16 16 4 4"></path>
                      </svg>
                      Kelola Admin
                    </Button>
                  </Link>
                  <Link to="/super-admin/program-management">
                    <Button className="w-full" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2"></path>
                        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2"></path>
                        <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2"></path>
                        <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2"></path>
                      </svg>
                      Manajemen Program
                    </Button>
                  </Link>
                  <Link to="/super-admin/activity-logs">
                    <Button className="w-full" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                      Log Aktivitas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 