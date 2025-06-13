import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  // Data untuk diagram perbandingan status pendaftaran
  const statusData = {
    labels: ['Diterima', 'Ditolak', 'Menunggu Verifikasi'],
    datasets: [
      {
        data: [120, 30, 50],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Hijau
          'rgba(239, 68, 68, 0.8)',  // Merah
          'rgba(234, 179, 8, 0.8)',  // Kuning
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data untuk diagram perbandingan tahunan
  const yearlyData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Jumlah Pendaftar',
        data: [150, 180, 200, 220, 250],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Data untuk diagram perbandingan status per tahun
  const yearlyStatusData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Diterima',
        data: [100, 120, 140, 150, 180],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Ditolak',
        data: [50, 60, 60, 70, 70],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
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
    },
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Kepala Sekolah</h1>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Kelola data siswa dan informasi akademik</p>
            <Button onClick={() => navigate('/headmaster/students')}>
              Lihat Data Siswa
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Guru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Kelola data guru dan jadwal mengajar</p>
            <Button onClick={() => navigate('/headmaster/teachers')}>
              Lihat Data Guru
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Lihat laporan akademik dan keuangan</p>
            <Button onClick={() => navigate('/headmaster/reports')}>
              Lihat Laporan
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Pendaftaran Tahun Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={statusData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Jumlah Pendaftar per Tahun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar data={yearlyData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perbandingan Status Pendaftaran per Tahun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar 
                data={yearlyStatusData} 
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
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