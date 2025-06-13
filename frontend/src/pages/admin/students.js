import React, { useState } from "react";
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

export default function AdminStudents() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // Mock data - replace with actual API data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ahmad Fauzi",
      email: "ahmad@example.com",
      registrationDate: "2024-03-15",
      status: "pending",
      documents: {
        akte: true,
        kk: true,
        rapor: true
      },
      // Additional student details
      birthDate: "2005-05-15",
      address: "Jl. Merdeka No. 123, Jakarta",
      phone: "081234567890",
      parentName: "Budi Fauzi",
      parentPhone: "081234567891",
      // Status change information
      statusChangedBy: null,
      statusChangedAt: null
    },
    {
      id: 2,
      name: "Siti Aminah",
      email: "siti@example.com",
      registrationDate: "2024-03-14",
      status: "pending",
      documents: {
        akte: true,
        kk: true,
        rapor: false
      },
      // Additional student details
      birthDate: "2005-06-20",
      address: "Jl. Sudirman No. 45, Jakarta",
      phone: "081234567892",
      parentName: "Aminah Siti",
      parentPhone: "081234567893",
      // Status change information
      statusChangedBy: null,
      statusChangedAt: null
    },
  ]);

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      // Here you would normally make an API call to update the status
      setStudents(students.map(student => {
        if (student.id === studentId) {
          return { 
            ...student, 
            status: newStatus,
            statusChangedBy: "Admin Name", // Replace with actual admin name
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
        description: "Terjadi kesalahan saat memperbarui status siswa",
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
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kelola Kelulusan</h1>
            <p className="text-muted-foreground">Tentukan kelulusan siswa baru</p>
          </div>
          <Link to="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Kembali ke Dashboard
            </Button>
          </Link>
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
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Tanggal Daftar</th>
                <th className="p-4 text-left">Status Dokumen</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Aksi</th>
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
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        student.documents.akte ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        Akte
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        student.documents.kk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        KK
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        student.documents.rapor ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        Rapor
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      student.status === "accepted" 
                        ? "bg-green-100 text-green-800"
                        : student.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {student.status === "accepted" 
                        ? "Diterima" 
                        : student.status === "rejected"
                        ? "Ditolak"
                        : "Menunggu Keputusan"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {student.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => openConfirmDialog(student, "accepted")}
                          >
                            Terima
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => openConfirmDialog(student, "rejected")}
                          >
                            Tolak
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDetailDialog(student)}
                      >
                        Detail
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan Status</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin {pendingAction === "accepted" ? "menerima" : "menolak"} siswa {selectedStudent?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Batal
            </Button>
            <Button 
              variant={pendingAction === "accepted" ? "default" : "destructive"}
              onClick={confirmStatusChange}
            >
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Informasi Pribadi</h3>
                  <p>Nama: {selectedStudent.name}</p>
                  <p>Email: {selectedStudent.email}</p>
                  <p>Tanggal Lahir: {selectedStudent.birthDate}</p>
                  <p>Alamat: {selectedStudent.address}</p>
                  <p>No. Telepon: {selectedStudent.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Informasi Orang Tua</h3>
                  <p>Nama Orang Tua: {selectedStudent.parentName}</p>
                  <p>No. Telepon Orang Tua: {selectedStudent.parentPhone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Status Dokumen</h3>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    selectedStudent.documents.akte ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    Akte
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    selectedStudent.documents.kk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    KK
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    selectedStudent.documents.rapor ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    Rapor
                  </span>
                </div>
              </div>

              {selectedStudent.status !== "pending" && (
                <div>
                  <h3 className="font-semibold">Informasi Keputusan</h3>
                  <p>Status: {selectedStudent.status === "accepted" ? "Diterima" : "Ditolak"}</p>
                  <p>Ditentukan oleh: {selectedStudent.statusChangedBy}</p>
                  <p>Waktu: {new Date(selectedStudent.statusChangedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 