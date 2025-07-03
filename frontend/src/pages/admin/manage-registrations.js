import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Sidebar } from "../../components/layout/sidebar";

export default function AdminManageRegistrations() {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("/api/pendaftaran/all", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal mengambil data pendaftaran");
        const data = await res.json();
        setStudents(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleDetailClick = (student) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  const filteredStudents = statusFilter
    ? students.filter(s => s.status_pendaftaran === statusFilter)
    : students;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Kelola Pendaftaran</h1>
                <p className="text-muted-foreground">Kelola pendaftaran siswa baru</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Cari pendaftar..."
                    className="h-10 rounded-md border px-4"
                  />
                  <select
                    className="h-10 rounded-md border px-4"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="proses">Menunggu Verifikasi</option>
                    <option value="lulus">Terverifikasi</option>
                    <option value="tidak_lulus">Ditolak</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-4">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left">Nama</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Tanggal Daftar</th>
                      <th className="p-4 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.pendaftaran_id} className="border-b">
                        <td className="p-4">{student.nama_siswa}</td>
                        <td className="p-4">{student.email_orangtua}</td>
                        <td className="p-4">
                          {student.status_pendaftaran === "proses" && (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                              Menunggu Verifikasi
                            </span>
                          )}
                          {student.status_pendaftaran === "lulus" && (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                              Terverifikasi
                            </span>
                          )}
                          {student.status_pendaftaran === "tidak_lulus" && (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                              Ditolak
                            </span>
                          )}
                        </td>
                        <td className="p-4">{new Date(student.tanggal_daftar).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDetailClick(student)}
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Detail Modal */}
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detail Pendaftaran</DialogTitle>
              </DialogHeader>
              {selectedStudent && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Informasi Siswa</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Nama:</span> {selectedStudent.nama_siswa}</p>
                        <p><span className="font-medium">Jenis Kelamin:</span> {selectedStudent.jenis_kelamin}</p>
                        <p><span className="font-medium">Tanggal Lahir:</span> {selectedStudent.tanggal_lahir}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Informasi Orang Tua</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Nama Wali:</span> {selectedStudent.nama_orangtua}</p>
                        <p><span className="font-medium">Email:</span> {selectedStudent.email_orangtua}</p>
                        <p><span className="font-medium">No. Telepon:</span> {selectedStudent.no_hp_orangtua}</p>
                        <p><span className="font-medium">Alamat:</span> {selectedStudent.alamat_orangtua}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Informasi Pendaftaran</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Program:</span> {selectedStudent.nama_program}</p>
                      <p><span className="font-medium">Tahun Ajaran:</span> {selectedStudent.tahun_ajaran}</p>
                      <p><span className="font-medium">Tanggal Daftar:</span> {new Date(selectedStudent.tanggal_daftar).toLocaleDateString()}</p>
                      <p><span className="font-medium">Status:</span> {selectedStudent.status_pendaftaran}</p>
                      <p><span className="font-medium">Catatan:</span> {selectedStudent.catatan || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 