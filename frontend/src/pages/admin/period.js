import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export default function AdminPeriod() {
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState(null);
  const [newPeriod, setNewPeriod] = useState({
    name: "",
    startDate: "",
    endDate: "",
    academicYear: "",
    status: "active"
  });
  const { toast } = useToast();

  // Simulasi data periode pendaftaran
  const [registrationPeriods, setRegistrationPeriods] = useState([
    {
      id: 1,
      name: "Pendaftaran Tahun Ajaran 2024/2025",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      academicYear: "2024/2025",
      status: "active"
    },
    {
      id: 2,
      name: "Pendaftaran Tahun Ajaran 2023/2024",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      academicYear: "2023/2024",
      status: "completed"
    }
  ]);

  const handleAddPeriod = () => {
    // Simulasi penambahan periode
    const newId = Math.max(...registrationPeriods.map(p => p.id)) + 1;
    const periodToAdd = {
      ...newPeriod,
      id: newId
    };
    
    setRegistrationPeriods([...registrationPeriods, periodToAdd]);
    toast({
      title: "Periode pendaftaran berhasil ditambahkan",
      description: "Periode pendaftaran baru telah ditambahkan ke sistem",
    });
    setIsAddingPeriod(false);
    setNewPeriod({
      name: "",
      startDate: "",
      endDate: "",
      academicYear: "",
      status: "active"
    });
  };

  const handleEditClick = (period) => {
    setEditingPeriodId(period.id);
    setNewPeriod({
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
      academicYear: period.academicYear,
      status: period.status
    });
    setIsEditingPeriod(true);
  };

  const handleEditSave = () => {
    // Simulasi update periode
    setRegistrationPeriods(registrationPeriods.map(period => 
      period.id === editingPeriodId 
        ? { ...period, ...newPeriod }
        : period
    ));

    toast({
      title: "Periode pendaftaran berhasil diperbarui",
      description: "Perubahan telah disimpan ke sistem",
    });

    setIsEditingPeriod(false);
    setEditingPeriodId(null);
    setNewPeriod({
      name: "",
      startDate: "",
      endDate: "",
      academicYear: "",
      status: "active"
    });
  };

  const handleDeleteClick = (period) => {
    setPeriodToDelete(period);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (periodToDelete) {
      setRegistrationPeriods(registrationPeriods.filter(period => period.id !== periodToDelete.id));
      toast({
        title: "Periode pendaftaran berhasil dihapus",
        description: "Periode pendaftaran telah dihapus dari sistem",
      });
      setDeleteDialogOpen(false);
      setPeriodToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsAddingPeriod(false);
    setIsEditingPeriod(false);
    setEditingPeriodId(null);
    setNewPeriod({
      name: "",
      startDate: "",
      endDate: "",
      academicYear: "",
      status: "active"
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Periode Pendaftaran</h1>
          <p className="text-muted-foreground">Atur periode pendaftaran siswa baru</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
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
              className="h-4 w-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Kembali ke Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <Button onClick={() => setIsAddingPeriod(true)}>
          Tambah Periode Pendaftaran
        </Button>
      </div>

      {(isAddingPeriod || isEditingPeriod) && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditingPeriod ? "Edit Periode Pendaftaran" : "Tambah Periode Pendaftaran Baru"}
          </h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodName">Nama Periode</Label>
              <Input
                id="periodName"
                placeholder="Contoh: Pendaftaran Tahun Ajaran 2024/2025"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear">Tahun Ajaran</Label>
              <Input
                id="academicYear"
                placeholder="Contoh: 2024/2025"
                value={newPeriod.academicYear}
                onChange={(e) => setNewPeriod({ ...newPeriod, academicYear: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
              <Button onClick={isEditingPeriod ? handleEditSave : handleAddPeriod}>
                {isEditingPeriod ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Periode Pendaftaran</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus periode pendaftaran ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {periodToDelete && (
            <div className="py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Detail Periode:</p>
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Nama:</span> {periodToDelete.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tahun Ajaran:</span> {periodToDelete.academicYear}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Periode:</span>{" "}
                    {new Date(periodToDelete.startDate).toLocaleDateString("id-ID")} -{" "}
                    {new Date(periodToDelete.endDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPeriodToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Daftar Periode Pendaftaran</h2>
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Nama Periode</th>
                <th className="p-4 text-left font-medium">Tahun Ajaran</th>
                <th className="p-4 text-left font-medium">Tanggal Mulai</th>
                <th className="p-4 text-left font-medium">Tanggal Selesai</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {registrationPeriods.map((period) => (
                <tr key={period.id} className="border-b">
                  <td className="p-4">{period.name}</td>
                  <td className="p-4">{period.academicYear}</td>
                  <td className="p-4">{new Date(period.startDate).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">{new Date(period.endDate).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      period.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {period.status === 'active' ? 'Aktif' : 'Selesai'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => handleEditClick(period)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(period)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 