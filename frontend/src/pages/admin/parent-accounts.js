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

export default function ParentAccounts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [pathFilter, setPathFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);
  const { toast } = useToast();

  // Simulasi data wali murid
  const [parents, setParents] = useState([
    {
      id: 1,
      name: "Ahmad Hidayat",
      email: "ahmad@email.com",
      phone: "081234567890",
      status: "active",
      registrationDate: "2024-02-15",
      program: "boarding",
      path: "reguler",
      student: {
        name: "Muhammad Hidayat",
        grade: "7",
      },
      activityHistory: [
        {
          date: "2024-03-20 14:30",
          activity: "Login ke sistem",
        },
        {
          date: "2024-03-19 10:15",
          activity: "Update data siswa",
        },
      ],
    },
    // Tambahkan data dummy lainnya sesuai kebutuhan
  ]);

  const handleStatusChange = (parentId, newStatus) => {
    setParents(parents.map(parent => 
      parent.id === parentId 
        ? { ...parent, status: newStatus }
        : parent
    ));
    toast({
      title: "Status berhasil diubah",
      description: `Status akun telah diubah menjadi ${newStatus === 'active' ? 'aktif' : 'nonaktif'}`,
    });
  };

  const handleResetPassword = (parentId) => {
    // Implementasi reset password
    toast({
      title: "Password berhasil direset",
      description: "Password baru telah dikirim ke email wali murid",
    });
    setIsResettingPassword(false);
  };

  const handleEditParent = (parent) => {
    setSelectedParent(parent);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Implementasi simpan perubahan
    toast({
      title: "Data berhasil diperbarui",
      description: "Informasi wali murid telah diperbarui",
    });
    setIsEditing(false);
    setSelectedParent(null);
  };

  const openDeleteConfirm = (parent) => {
    setParentToDelete(parent);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteParent = () => {
    if (parentToDelete) {
      handleDeleteParent(parentToDelete.id);
      setShowDeleteConfirm(false);
      setParentToDelete(null);
    }
  };

  const handleDeleteParent = (parentId) => {
    setParents(parents.filter(parent => parent.id !== parentId));
    toast({
      title: "Akun berhasil dihapus",
      description: "Akun wali murid telah dihapus dari sistem",
    });
  };

  const handleExportData = () => {
    // Implementasi ekspor data ke Excel/PDF
    toast({
      title: "Data berhasil diekspor",
      description: "Data wali murid telah diekspor ke Excel",
    });
  };

  const filteredParents = parents.filter(parent => {
    const matchesSearch = 
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || parent.status === statusFilter;
    const matchesProgram = programFilter === "all" || parent.program === programFilter;
    const matchesPath = pathFilter === "all" || parent.path === pathFilter;
    
    return matchesSearch && matchesStatus && matchesProgram && matchesPath;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Akun Wali Murid</h1>
          <p className="text-muted-foreground">Kelola akun wali murid yang terdaftar</p>
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

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status Akun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
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
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Registrasi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParents.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell className="font-medium">{parent.name}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{parent.student.name}</p>
                    <p className="text-sm text-muted-foreground">Kelas {parent.student.grade}</p>
                  </div>
                </TableCell>
                <TableCell>{parent.email}</TableCell>
                <TableCell>{parent.phone}</TableCell>
                <TableCell>
                  <Badge variant={parent.status === "active" ? "success" : "secondary"}>
                    {parent.status === "active" ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(parent.registrationDate), "dd MMMM yyyy", { locale: id })}
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
                      <DropdownMenuItem onClick={() => handleStatusChange(parent.id, parent.status === "active" ? "inactive" : "active")}>
                        {parent.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedParent(parent);
                        setIsResettingPassword(true);
                      }}>
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedParent(parent);
                        setShowActivityHistory(true);
                      }}>
                        Riwayat Aktivitas
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => openDeleteConfirm(parent)}
                      >
                        Hapus Akun
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
                  value={selectedParent.name}
                  onChange={(e) => setSelectedParent({ ...selectedParent, name: e.target.value })}
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
                  value={selectedParent.phone}
                  onChange={(e) => setSelectedParent({ ...selectedParent, phone: e.target.value })}
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

      {/* Dialog Reset Password */}
      <Dialog open={isResettingPassword} onOpenChange={setIsResettingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Password baru akan dikirim ke email wali murid
            </DialogDescription>
          </DialogHeader>
          {selectedParent && (
            <div className="py-4">
              <p className="text-sm">
                Anda akan mereset password untuk akun:
              </p>
              <p className="font-medium">{selectedParent.name}</p>
              <p className="text-sm text-muted-foreground">{selectedParent.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResettingPassword(false)}>
              Batal
            </Button>
            <Button onClick={() => handleResetPassword(selectedParent?.id)}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Riwayat Aktivitas */}
      <Dialog open={showActivityHistory} onOpenChange={setShowActivityHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Riwayat Aktivitas</DialogTitle>
            <DialogDescription>
              Riwayat aktivitas wali murid
            </DialogDescription>
          </DialogHeader>
          {selectedParent && (
            <div className="py-4">
              <div className="space-y-4">
                {selectedParent.activityHistory.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{activity.activity}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(activity.date), "dd MMMM yyyy HH:mm", { locale: id })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowActivityHistory(false)}>
              Tutup
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
                <p className="font-medium">{parentToDelete?.name}</p>
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
  );
} 