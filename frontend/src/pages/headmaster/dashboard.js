import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function HeadmasterDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State untuk data real dari API
  const [dashboardData, setDashboardData] = useState({
    totalSiswa: { total: 0 },
    totalPendaftaran: { total: 0 },
    pendaftaranPerStatus: [],
    pendaftaranPerProgram: [],
    pendaftaranPerTahun: []
  });

  // State untuk chart data
  const [chartData, setChartData] = useState({
    statusChart: null,
    programChart: null,
    yearlyChart: null,
    monthlyChart: null
  });

  const getToken = () => {
    return localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);
  };

  // Fetch dashboard summary data
  const fetchDashboardSummary = async () => {
    try {
      const response = await fetch('/api/headmaster/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data dashboard');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data dashboard",
        variant: "destructive",
      });
    }
  };

  // Fetch chart statistics
  const fetchChartStatistics = async () => {
    try {
      const response = await fetch(`/api/headmaster/statistics/charts?tahun=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data chart');
      }

      const data = await response.json();
      setChartData(data.data);
    } catch (error) {
      console.error('Error fetching chart statistics:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data chart",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardSummary(),
        fetchChartStatistics()
      ]);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    fetchChartStatistics();
  }, [selectedYear]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Prepare chart data dari API
  const statusData = chartData.statusChart ? {
    labels: chartData.statusChart.map(item => {
      const statusMap = {
        'proses': 'Menunggu Verifikasi',
        'lulus': 'Diterima',
        'tidak_lulus': 'Ditolak',
        'cadangan': 'Cadangan'
      };
      return statusMap[item.status_pendaftaran] || item.status_pendaftaran;
    }),
    datasets: [
      {
        data: chartData.statusChart.map(item => item.total),
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',  // Kuning untuk menunggu
          'rgba(34, 197, 94, 0.8)',  // Hijau untuk diterima
          'rgba(239, 68, 68, 0.8)',  // Merah untuk ditolak
          'rgba(59, 130, 246, 0.8)', // Biru untuk cadangan
        ],
        borderColor: [
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['Menunggu Verifikasi', 'Diterima', 'Ditolak', 'Cadangan'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const yearlyData = chartData.yearlyChart ? {
    labels: chartData.yearlyChart.map(item => item.tahun),
    datasets: [
      {
        label: 'Jumlah Pendaftar',
        data: chartData.yearlyChart.map(item => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Jumlah Pendaftar',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const programData = chartData.programChart ? {
    labels: chartData.programChart.map(item => item.nama_program),
    datasets: [
      {
        label: 'Jumlah Pendaftar',
        data: chartData.programChart.map(item => item.total),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['IPA', 'IPS', 'Bahasa'],
    datasets: [
      {
        label: 'Jumlah Pendaftar',
        data: [0, 0, 0],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Kepala Sekolah</h1>
          <p className="text-muted-foreground mt-1">Selamat datang di panel kepala sekolah</p>
        </div>
        <Button 
          variant="destructive" 
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar
        </Button>
      </div>
      
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

      {/* Summary Cards - SUDAH TERINTEGRASI DENGAN API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalSiswa.total}</div>
            <p className="text-xs text-muted-foreground">
              Siswa terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalPendaftaran.total}</div>
            <p className="text-xs text-muted-foreground">
              Pendaftaran tahun ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.pendaftaranPerStatus.find(item => item.status_pendaftaran === 'proses')?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Perlu ditinjau
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diterima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.pendaftaranPerStatus.find(item => item.status_pendaftaran === 'lulus')?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sudah diterima
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Data Siswa</CardTitle>
            <Button onClick={() => navigate('/headmaster/students')} className="bg-primary hover:bg-primary/90">
              Lihat Data Siswa
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Kelola data siswa dan informasi akademik</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Status Pendaftaran</CardTitle>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={statusData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Perbandingan Jumlah Pendaftar</CardTitle>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar data={yearlyData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Pendaftaran per Program</CardTitle>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar 
                data={programData} 
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Jumlah Siswa'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Program'
                      }
                    }
                  },
                }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HeadmasterDashboard; 