import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Sidebar } from "../../components/layout/sidebar";

export default function AdminStudents() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping status frontend <-> backend
  const statusMap = {
    proses: "pending",
    lulus: "accepted",
    tidak_lulus: "rejected",
    cadangan: "waiting"
  };
  const reverseStatusMap = {
    pending: "proses",
    accepted: "lulus",
    rejected: "tidak_lulus",
    waiting: "cadangan"
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("/api/pendaftaran/all", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Gagal mengambil data siswa");
        const data = await res.json();
        setStudents((data.data || []).map(item => ({
          id: item.pendaftaran_id,
          name: item.nama_siswa,
          email: item.email_orangtua,
          registrationDate: item.tanggal_daftar ? new Date(item.tanggal_daftar).toLocaleDateString() : '',
          status: statusMap[item.status_pendaftaran] || item.status_pendaftaran,
          documents: {
            akte: true, // TODO: Integrasi status dokumen jika ada
            kk: true,
            rapor: true
          },
          birthDate: item.tanggal_lahir,
          address: item.alamat_orangtua,
          phone: item.no_hp_orangtua,
          parentName: item.nama_orangtua,
          parentPhone: item.no_hp_orangtua,
          statusChangedBy: null,
          statusChangedAt: null
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/pendaftaran/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status_pendaftaran: reverseStatusMap[newStatus] })
      });
      if (!res.ok) throw new Error("Gagal memperbarui status siswa");
      setStudents(students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            status: newStatus,
            statusChangedBy: "Admin", // Bisa diisi nama admin dari token/user
            statusChangedAt: new Date().toISOString()
          };
        }
        return student;
      }));
      toast({
        title: newStatus === "accepted" ? "Siswa Diterima" : "Siswa Ditolak",
        description: newStatus === "accepted"
          ? "Status kelulusan siswa telah diperbarui"
          : "Status penolakan siswa telah diperbarui",
      });
    } catch (error) {
      toast({
        title: "Gagal Memperbarui Status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openConfirmDialog = (student, action) => {
    setSelectedStudent(student);
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const openDetailDialog = (student) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  const confirmStatusChange = () => {
    if (selectedStudent && pendingAction) {
      handleStatusChange(selectedStudent.id, pendingAction);
      setShowConfirmDialog(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Kelola Kelulusan</h1>
                <p className="text-muted-foreground">Tentukan kelulusan siswa baru</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Cari siswa..."
                    className="h-10 rounded-md border px-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select 
                    className="h-10 rounded-md border px-4"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="pending">Menunggu Keputusan</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
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
                    <th className="p-4 text-left">Tanggal Daftar</th>
                    <th className="p-4 text-left">Status Dokumen</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Aksi</th>
                    <th className="p-4 text-left">Aksi Kelulusan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4">{student.registrationDate}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs ${student.documents.akte ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>Akte</span>
                          <span className={`rounded-full px-2 py-1 text-xs ${student.documents.kk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>KK</span>
                          <span className={`rounded-full px-2 py-1 text-xs ${student.documents.rapor ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>Rapor</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {student.status === "pending" && (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Menunggu Keputusan</span>
                        )}
                        {student.status === "accepted" && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Diterima</span>
                        )}
                        {student.status === "rejected" && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Ditolak</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailDialog(student)}
                        >
                          Detail
                        </Button>
                      </td>
                      <td className="p-4">
                        {student.status === "pending" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="mr-2"
                              onClick={() => openConfirmDialog(student, "accepted")}
                            >
                              Terima
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openConfirmDialog(student, "rejected")}
                            >
                              Tolak
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
          {/* Dialog konfirmasi dan detail tetap sama */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Perubahan Status</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin mengubah status siswa ini menjadi {pendingAction === "accepted" ? "Diterima" : "Ditolak"}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Batal
                </Button>
                <Button variant={pendingAction === "accepted" ? "success" : "destructive"} onClick={confirmStatusChange}>
                  Ya, Ubah Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detail Siswa</DialogTitle>
              </DialogHeader>
              {selectedStudent && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Informasi Siswa</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Nama:</span> {selectedStudent.name}</p>
                        <p><span className="font-medium">Tanggal Lahir:</span> {selectedStudent.birthDate}</p>
                        <p><span className="font-medium">Alamat:</span> {selectedStudent.address}</p>
                        <p><span className="font-medium">No. Telepon:</span> {selectedStudent.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Informasi Orang Tua</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Nama Wali:</span> {selectedStudent.parentName}</p>
                        <p><span className="font-medium">No. Telepon Wali:</span> {selectedStudent.parentPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Status Dokumen</h3>
                    <div className="flex gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${selectedStudent.documents.akte ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        Akte
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs ${selectedStudent.documents.kk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        KK
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs ${selectedStudent.documents.rapor ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        Rapor
                      </span>
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