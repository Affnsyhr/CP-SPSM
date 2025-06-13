import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useNavigate } from 'react-router-dom';

function HeadmasterReports() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/headmaster/dashboard')}>
            Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Laporan</h1>
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Jenis Laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Laporan Akademik</SelectItem>
              <SelectItem value="financial">Laporan Keuangan</SelectItem>
              <SelectItem value="attendance">Laporan Kehadiran</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Laporan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Akademik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Lihat laporan nilai, prestasi, dan perkembangan akademik siswa
            </p>
            <Button variant="outline" className="w-full">
              Lihat Laporan Akademik
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Keuangan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Lihat laporan keuangan sekolah, SPP, dan pengeluaran
            </p>
            <Button variant="outline" className="w-full">
              Lihat Laporan Keuangan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Lihat laporan kehadiran siswa dan guru
            </p>
            <Button variant="outline" className="w-full">
              Lihat Laporan Kehadiran
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HeadmasterReports; 