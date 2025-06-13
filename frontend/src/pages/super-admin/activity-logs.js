import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function ActivityLogs() {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [exportFormat, setExportFormat] = useState("csv");

  // Mock data - replace with actual API data
  const logs = [
    {
      id: 1,
      timestamp: "2024-03-15 10:30:45",
      user: {
        name: "Budi Santoso",
        role: "Admin TU",
        email: "budi@example.com"
      },
      activity: "Verifikasi Dokumen",
      details: {
        action: "Verifikasi dokumen pendaftaran",
        target: "Ahmad Fauzi",
        changes: "Status dokumen diubah dari 'Menunggu' menjadi 'Terverifikasi'",
        ipAddress: "192.168.1.1",
        browser: "Chrome 122.0.0",
        device: "Desktop"
      },
      status: "success"
    },
    {
      id: 2,
      timestamp: "2024-03-15 09:15:22",
      user: {
        name: "Ahmad Hidayat",
        role: "Kepala Sekolah",
        email: "ahmad@example.com"
      },
      activity: "Update Status Pendaftaran",
      details: {
        action: "Mengubah status pendaftaran",
        target: "Siti Nurul",
        changes: "Status diubah dari 'Menunggu Verifikasi' menjadi 'Diterima'",
        ipAddress: "192.168.1.2",
        browser: "Firefox 123.0",
        device: "Desktop"
      },
      status: "success"
    },
    {
      id: 3,
      timestamp: "2024-03-14 16:45:10",
      user: {
        name: "Siti Aminah",
        role: "Orang Tua",
        email: "siti@example.com"
      },
      activity: "Login",
      details: {
        action: "Login ke sistem",
        target: "Dashboard Orang Tua",
        changes: null,
        ipAddress: "192.168.1.3",
        browser: "Safari 17.0",
        device: "Mobile"
      },
      status: "success"
    }
  ];

  const handleDetailClick = (log) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log(`Exporting to ${exportFormat}...`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Log Aktivitas</h1>
        <p className="text-muted-foreground">Catatan aktivitas pengguna dalam sistem</p>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Cari aktivitas..."
              className="h-10 w-full rounded-md border px-4"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua User</SelectItem>
              <SelectItem value="admin">Admin TU</SelectItem>
              <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
              <SelectItem value="parent">Orang Tua</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Jenis Aktivitas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aktivitas</SelectItem>
              <SelectItem value="login">Login/Logout</SelectItem>
              <SelectItem value="crud">CRUD Data</SelectItem>
              <SelectItem value="verify">Verifikasi</SelectItem>
              <SelectItem value="status">Perubahan Status</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport}>Ekspor</Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Waktu</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Aktivitas</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-4">{log.timestamp}</td>
                  <td className="p-4">{log.user.name}</td>
                  <td className="p-4">{log.user.role}</td>
                  <td className="p-4">{log.activity}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      log.status === "success" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {log.status === "success" ? "Berhasil" : "Gagal"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDetailClick(log)}
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
            <DialogTitle>Detail Aktivitas</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Informasi User</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nama:</span> {selectedLog.user.name}</p>
                    <p><span className="font-medium">Role:</span> {selectedLog.user.role}</p>
                    <p><span className="font-medium">Email:</span> {selectedLog.user.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informasi Aktivitas</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Waktu:</span> {selectedLog.timestamp}</p>
                    <p><span className="font-medium">Aktivitas:</span> {selectedLog.activity}</p>
                    <p><span className="font-medium">Status:</span> {selectedLog.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Detail Aktivitas</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Aksi:</span> {selectedLog.details.action}</p>
                  <p><span className="font-medium">Target:</span> {selectedLog.details.target}</p>
                  {selectedLog.details.changes && (
                    <p><span className="font-medium">Perubahan:</span> {selectedLog.details.changes}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Informasi Teknis</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">IP Address:</span> {selectedLog.details.ipAddress}</p>
                  <p><span className="font-medium">Browser:</span> {selectedLog.details.browser}</p>
                  <p><span className="font-medium">Device:</span> {selectedLog.details.device}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 