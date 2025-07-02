import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/use-toast";

function HeadmasterStudents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programFilter, setProgramFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const getToken = () => {
    return localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);
  };

  // Fetch students data
  const fetchStudents = async (page = 1, search = '', program = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: search,
        program: program === 'all' ? '' : program
      });

      const response = await fetch(`/api/headmaster/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data siswa');
      }

      const data = await response.json();
      setStudents(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data siswa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents(1, searchQuery, programFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, programFilter]);

  const handlePageChange = (page) => {
    fetchStudents(page, searchQuery, programFilter);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/headmaster/export/students', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        }
      });

      if (!response.ok) {
        throw new Error('Gagal export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'siswa-data.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Sukses",
        description: "Data berhasil di-export",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Gagal export data",
        variant: "destructive",
      });
    }
  };

  const handleDetailClick = (student) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'proses': { label: 'Menunggu Verifikasi', className: 'bg-yellow-100 text-yellow-800' },
      'lulus': { label: 'Diterima', className: 'bg-green-100 text-green-800' },
      'tidak_lulus': { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
      'cadangan': { label: 'Cadangan', className: 'bg-blue-100 text-blue-800' }
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && students.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data siswa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/headmaster/dashboard')}>
            Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Data Pendaftar Siswa Baru</h1>
        </div>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Cari nama siswa atau wali..."
            className="w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Program</SelectItem>
              <SelectItem value="Boarding School">Boarding School</SelectItem>
              <SelectItem value="Full Day School">Full Day School</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>Export Data</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead>Nama Wali</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student.siswa_id}>
                <TableCell>{(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}</TableCell>
                <TableCell>{student.nama_siswa}</TableCell>
                <TableCell>{student.nama_program || '-'}</TableCell>
                <TableCell>
                  {getStatusBadge(student.status_pendaftaran)}
                </TableCell>
                <TableCell>{new Date(student.created_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{student.nama_orangtua}</TableCell>
                <TableCell>{student.no_hp_orangtua}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDetailClick(student)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Sebelumnya
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Halaman {pagination.currentPage} dari {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* Total items info */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Menampilkan {students.length} dari {pagination.totalItems} data
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Informasi Siswa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informasi Siswa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                    <p className="text-sm">{selectedStudent.nama_siswa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tempat Lahir</label>
                    <p className="text-sm">{selectedStudent.tempat_lahir || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                    <p className="text-sm">{selectedStudent.tanggal_lahir ? formatDate(selectedStudent.tanggal_lahir) : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                    <p className="text-sm">{selectedStudent.jenis_kelamin || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program</label>
                    <p className="text-sm">{selectedStudent.nama_program || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status Pendaftaran</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedStudent.status_pendaftaran)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Orang Tua */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informasi Orang Tua</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Orang Tua</label>
                    <p className="text-sm">{selectedStudent.nama_orangtua}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">No. Telepon</label>
                    <p className="text-sm">{selectedStudent.no_hp_orangtua}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{selectedStudent.email_orangtua || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Informasi Pendaftaran */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informasi Pendaftaran</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal Daftar</label>
                    <p className="text-sm">{formatDate(selectedStudent.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tahun Ajaran</label>
                    <p className="text-sm">{selectedStudent.tahun_ajaran || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Catatan */}
              {selectedStudent.catatan && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Catatan</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">{selectedStudent.catatan}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HeadmasterStudents; 