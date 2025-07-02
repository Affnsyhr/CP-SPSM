import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Sidebar, superAdminMenu } from "../../components/layout/sidebar";
import { useToast } from "../../hooks/use-toast";

export default function SuperAdminAdmins() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin_tu"
  });

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const result = await response.json();
      setAdmins(result.data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin_tu"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role_id: formData.role === 'admin_tu' ? 3 : 4 // 3 for admin_tu, 4 for kepala_sekolah
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create admin');
      }

      toast({
        title: "Berhasil",
        description: "Admin berhasil dibuat",
      });

      setIsOpen(false);
      resetForm();
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat admin",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "",
      confirmPassword: "",
      role: admin.role_id === 3 ? "admin_tu" : "kepala_sekolah"
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const updateData = {
        username: formData.username,
        email: formData.email,
        role_id: formData.role === 'admin_tu' ? 3 : 4
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${selectedAdmin.user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update admin');
      }

      toast({
        title: "Berhasil",
        description: "Admin berhasil diperbarui",
      });

      setIsEditOpen(false);
      setSelectedAdmin(null);
      resetForm();
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error updating admin:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui admin",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/users/${selectedAdmin.user_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete admin');
      }

      toast({
        title: "Berhasil",
        description: "Admin berhasil dihapus",
      });

      setIsDeleteOpen(false);
      setSelectedAdmin(null);
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus admin",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleName = (role_id) => {
    if (role_id === 3) return "Admin TU";
    if (role_id === 4) return "Kepala Sekolah";
    return "Tidak diketahui";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar menu={superAdminMenu} />
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Memuat data admin...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar menu={superAdminMenu} />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Kelola Admin</h1>
                <p className="text-muted-foreground">Kelola akun admin madrasah</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Button onClick={() => setIsOpen(true)}>+ Tambah Admin</Button>
          </div>

          {/* Add Admin Dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Admin Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin_tu">Admin TU</SelectItem>
                        <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Masukkan password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Konfirmasi password"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Admin Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input
                      id="edit-username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin_tu">Admin TU</SelectItem>
                        <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-password">Password Baru (Opsional)</Label>
                    <Input
                      id="edit-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="edit-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Konfirmasi password baru"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus admin "{selectedAdmin?.username}"? 
                  Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
                  {submitting ? "Menghapus..." : "Hapus"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Admins Table */}
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-muted-foreground">
                        Tidak ada data admin
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin.user_id} className="border-b">
                        <td className="p-4">{admin.username}</td>
                        <td className="p-4">{admin.email}</td>
                        <td className="p-4">{getRoleName(admin.role_id)}</td>
                        <td className="p-4">
                          <span className="rounded-full px-2 py-1 text-xs bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(admin)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(admin)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 