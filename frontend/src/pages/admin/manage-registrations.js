import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export default function ManageRegistrations() {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data - replace with actual API data
  const students = [
    {
      id: 1,
      name: "Ahmad Fauzi",
      email: "ahmad@example.com",
      status: "pending",
      registrationDate: "2024-03-15",
      // Additional student details
      phone: "081234567890",
      address: "Jl. Merdeka No. 123",
      city: "Jakarta",
      province: "DKI Jakarta",
      parentName: "Budi Fauzi",
      program: "Boarding School",
      registrationPath: "Reguler",
      documents: {
        akte: true,
        kk: true,
        rapor: true
      }
    }
  ];

  const handleDetailClick = (student) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kelola Pendaftaran</h1>
            <p className="text-muted-foreground">Kelola pendaftaran siswa baru</p>
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
                placeholder="Cari pendaftar..."
                className="h-10 rounded-md border px-4"
              />
              <select className="h-10 rounded-md border px-4">
                <option value="">Semua Status</option>
                <option value="pending">Menunggu Verifikasi</option>
                <option value="verified">Terverifikasi</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            <Button>Filter</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
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
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                      Menunggu Verifikasi
                    </span>
                  </td>
                  <td className="p-4">{student.registrationDate}</td>
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
                    <p><span className="font-medium">Nama:</span> {selectedStudent.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                    <p><span className="font-medium">No. Telepon:</span> {selectedStudent.phone}</p>
                    <p><span className="font-medium">Alamat:</span> {selectedStudent.address}</p>
                    <p><span className="font-medium">Kota:</span> {selectedStudent.city}</p>
                    <p><span className="font-medium">Provinsi:</span> {selectedStudent.province}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informasi Pendaftaran</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nama Wali:</span> {selectedStudent.parentName}</p>
                    <p><span className="font-medium">Program:</span> {selectedStudent.program}</p>
                    <p><span className="font-medium">Jalur:</span> {selectedStudent.registrationPath}</p>
                    <p><span className="font-medium">Tanggal Daftar:</span> {selectedStudent.registrationDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status Dokumen</h3>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    selectedStudent.documents.akte ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    Akte Kelahiran
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    selectedStudent.documents.kk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    Kartu Keluarga
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    selectedStudent.documents.rapor ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    Rapor
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 