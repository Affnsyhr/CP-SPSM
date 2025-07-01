import React, { useState, useEffect } from "react";
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
import { Sidebar } from "../../components/layout/sidebar";

export default function AdminPeriod() {
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState(null);
  const [newPeriod, setNewPeriod] = useState({
    tahun_ajaran: "",
    tanggal_mulai: "",
    tanggal_berakhir: "",
    status: "aktif"
  });
  const { toast } = useToast();
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);

  // Fetch all periods from backend
  const fetchPeriods = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tahunajaran', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setPeriods(data.data);
      } else {
        setPeriods([]);
      }
    } catch (err) {
      setPeriods([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
    // eslint-disable-next-line
  }, []);

  // Add period
  const handleAddPeriod = async () => {
    try {
      const res = await fetch('/api/tahunajaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(newPeriod)
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Periode pendaftaran berhasil ditambahkan' });
        setIsAddingPeriod(false);
        setNewPeriod({ tahun_ajaran: "", tanggal_mulai: "", tanggal_berakhir: "", status: "aktif" });
        fetchPeriods();
      } else {
        toast({ title: 'Gagal menambah periode', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal menambah periode', description: err.message, variant: 'destructive' });
    }
  };

  // Edit period
  const handleEditClick = (period) => {
    setEditingPeriodId(period.id_tahunajaran);
    setNewPeriod({
      tahun_ajaran: period.tahun_ajaran,
      tanggal_mulai: period.tanggal_mulai.slice(0, 10),
      tanggal_berakhir: period.tanggal_berakhir.slice(0, 10),
      status: period.status
    });
    setIsEditingPeriod(true);
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`/api/tahunajaran/${editingPeriodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(newPeriod)
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Periode pendaftaran berhasil diperbarui' });
        setIsEditingPeriod(false);
        setEditingPeriodId(null);
        setNewPeriod({ tahun_ajaran: "", tanggal_mulai: "", tanggal_berakhir: "", status: "aktif" });
        fetchPeriods();
      } else {
        toast({ title: 'Gagal memperbarui periode', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal memperbarui periode', description: err.message, variant: 'destructive' });
    }
  };

  // Delete period
  const handleDeleteClick = (period) => {
    setPeriodToDelete(period);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (periodToDelete) {
      try {
        const res = await fetch(`/api/tahunajaran/${periodToDelete.id_tahunajaran}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) {
          toast({ title: 'Periode pendaftaran berhasil dihapus' });
          setDeleteDialogOpen(false);
          setPeriodToDelete(null);
          fetchPeriods();
        } else {
          const data = await res.json();
          toast({ title: 'Gagal menghapus periode', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
        }
      } catch (err) {
        toast({ title: 'Gagal menghapus periode', description: err.message, variant: 'destructive' });
      }
    }
  };

  const handleCancel = () => {
    setIsAddingPeriod(false);
    setIsEditingPeriod(false);
    setEditingPeriodId(null);
    setNewPeriod({ tahun_ajaran: "", tanggal_mulai: "", tanggal_berakhir: "", status: "aktif" });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Kelola Periode</h1>
              <p className="text-muted-foreground">Atur periode pendaftaran siswa baru</p>
            </div>
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
                    value={newPeriod.tahun_ajaran}
                    onChange={(e) => setNewPeriod({ ...newPeriod, tahun_ajaran: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newPeriod.tanggal_mulai}
                      onChange={(e) => setNewPeriod({ ...newPeriod, tanggal_mulai: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newPeriod.tanggal_berakhir}
                      onChange={(e) => setNewPeriod({ ...newPeriod, tanggal_berakhir: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Tahun Ajaran</Label>
                  <Input
                    id="academicYear"
                    placeholder="Contoh: 2024/2025"
                    value={newPeriod.tahun_ajaran}
                    onChange={(e) => setNewPeriod({ ...newPeriod, tahun_ajaran: e.target.value })}
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
                        <span className="font-medium">Nama:</span> {periodToDelete.tahun_ajaran}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Tahun Ajaran:</span> {periodToDelete.tahun_ajaran}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Periode:</span>{" "}
                        {new Date(periodToDelete.tanggal_mulai).toLocaleDateString("id-ID")} -{" "}
                        {new Date(periodToDelete.tanggal_berakhir).toLocaleDateString("id-ID")}
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
                  {periods.map((period) => (
                    <tr key={period.id_tahunajaran} className="border-b">
                      <td className="p-4">{period.tahun_ajaran}</td>
                      <td className="p-4">{period.tahun_ajaran}</td>
                      <td className="p-4">{new Date(period.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                      <td className="p-4">{new Date(period.tanggal_berakhir).toLocaleDateString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          period.status === 'aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {period.status === 'aktif' ? 'Aktif' : 'Selesai'}
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
      </div>
    </div>
  );
} 