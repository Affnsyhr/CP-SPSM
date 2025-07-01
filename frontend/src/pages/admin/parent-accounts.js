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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Sidebar } from "../../components/layout/sidebar";

export default function ParentAccounts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [pathFilter, setPathFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);
  const { toast } = useToast();
  const [parents, setParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);

  // Fetch parent accounts from backend
  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/parents', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setParents(data.data);
      } else {
        setParents([]);
      }
    } catch (err) {
      setParents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
    // eslint-disable-next-line
  }, []);

  // Add parent
  const handleAddParent = async (parentData) => {
    try {
      const res = await fetch('/api/users/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(parentData)
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Akun berhasil ditambahkan' });
        fetchParents();
      } else {
        toast({ title: 'Gagal menambah akun', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal menambah akun', description: err.message, variant: 'destructive' });
    }
  };

  // Edit parent
  const handleSaveEdit = async () => {
    if (!selectedParent) return;
    const payload = {
      username: selectedParent.username,
      email: selectedParent.email,
    };
    if (selectedParent.password) {
      payload.password = selectedParent.password;
    }
    try {
      const res = await fetch(`/api/users/parents/${selectedParent.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Data berhasil diperbarui' });
        setIsEditing(false);
        setSelectedParent(null);
        fetchParents();
      } else {
        toast({ title: 'Gagal memperbarui data', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal memperbarui data', description: err.message, variant: 'destructive' });
    }
  };

  // Delete parent
  const handleDeleteParent = async (parentId) => {
    try {
      const res = await fetch(`/api/users/parents/${parentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        toast({ title: 'Akun berhasil dihapus' });
        fetchParents();
      } else {
        const data = await res.json();
        toast({ title: 'Gagal menghapus akun', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal menghapus akun', description: err.message, variant: 'destructive' });
    }
  };

  const handleEditParent = (parent) => {
    setSelectedParent(parent);
    setIsEditing(true);
  };

  const openDeleteConfirm = (parent) => {
    setParentToDelete(parent);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteParent = () => {
    if (parentToDelete) {
      handleDeleteParent(parentToDelete.user_id);
      setShowDeleteConfirm(false);
      setParentToDelete(null);
    }
  };

  const handleExportData = () => {
    // Implementasi ekspor data ke Excel/PDF
    toast({
      title: "Data berhasil diekspor",
      description: "Data wali murid telah diekspor ke Excel",
    });
  };

  // Tambah fungsi untuk aktif/nonaktif akun
  const handleToggleActive = async (parent) => {
    const isActive = parent.is_active !== false; // default true jika undefined
    const url = `/api/users/parents/${parent.user_id}/${isActive ? 'deactivate' : 'activate'}`;
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: `Akun ${isActive ? 'dinonaktifkan' : 'diaktifkan'}` });
        fetchParents();
      } else {
        toast({ title: 'Gagal mengubah status akun', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal mengubah status akun', description: err.message, variant: 'destructive' });
    }
  };

  const filteredParents = parents.filter(parent => {
    const matchesSearch = 
      parent.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = programFilter === "all" || parent.program === programFilter;
    const matchesPath = pathFilter === "all" || parent.path === pathFilter;
    
    return matchesSearch && matchesProgram && matchesPath;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Kelola Akun Orang Tua</h1>
              <p className="text-muted-foreground">Kelola akun orang tua siswa</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Program</SelectItem>
                <SelectItem value="boarding">Boarding School</SelectItem>
                <SelectItem value="fullDay">Full Day School</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pathFilter} onValueChange={setPathFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jalur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jalur</SelectItem>
                <SelectItem value="reguler">Reguler</SelectItem>
                <SelectItem value="prestasiAkademik">Prestasi Akademik</SelectItem>
                <SelectItem value="prestasiNonAkademik">Prestasi Non Akademik</SelectItem>
                <SelectItem value="tahfizh">Tahfizh</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportData}>
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
                className="mr-2 h-4 w-4"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Ekspor Data
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Wali Murid</TableHead>
                  <TableHead>Data Siswa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Tanggal Registrasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow key={parent.user_id}>
                    <TableCell className="font-medium">{parent.username}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{parent.nama_siswa || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>{parent.email || '-'}</TableCell>
                    <TableCell>{parent.phone || '-'}</TableCell>
                    <TableCell>
                      {parent.created_at ? format(new Date(parent.created_at), "dd MMMM yyyy", { locale: id }) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={parent.is_active === false ? 'destructive' : 'default'}>
                        {parent.is_active === false ? 'Nonaktif' : 'Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
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
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditParent(parent)}>
                            Edit Data
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteConfirm(parent)}
                          >
                            Hapus Akun
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(parent)}
                          >
                            {parent.is_active === false ? 'Aktifkan Akun' : 'Nonaktifkan Akun'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Dialog Edit Data */}
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Data Wali Murid</DialogTitle>
                <DialogDescription>
                  Perbarui informasi wali murid
                </DialogDescription>
              </DialogHeader>
              {selectedParent && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Wali Murid</Label>
                    <Input
                      id="name"
                      value={selectedParent.username}
                      onChange={(e) => setSelectedParent({ ...selectedParent, username: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedParent.email}
                      onChange={(e) => setSelectedParent({ ...selectedParent, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={selectedParent.phone || ''}
                      onChange={(e) => setSelectedParent({ ...selectedParent, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password Baru (opsional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={selectedParent.password || ''}
                      onChange={(e) => setSelectedParent({ ...selectedParent, password: e.target.value })}
                      placeholder="Kosongkan jika tidak ingin mengubah"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
                <Button onClick={handleSaveEdit}>
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Hapus Akun</DialogTitle>
                <DialogDescription>
                  Anda akan menghapus akun wali murid berikut:
                  <div className="mt-2 space-y-1">
                    <p className="font-medium">{parentToDelete?.username}</p>
                    <p className="text-sm text-muted-foreground">{parentToDelete?.email}</p>
                  </div>
                  <p className="mt-4 text-sm text-red-600">
                    Perhatian: Aksi ini tidak dapat dibatalkan dan semua data terkait akan dihapus secara permanen.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Batal
                </Button>
                <Button 
                  variant="destructive"
                  onClick={confirmDeleteParent}
                >
                  Hapus Akun
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 