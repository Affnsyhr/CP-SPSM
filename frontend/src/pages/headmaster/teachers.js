import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from 'react-router-dom';

function HeadmasterTeachers() {
  const navigate = useNavigate();
  
  // Mock data untuk admin - replace dengan data API
  const admins = [
    { 
      id: 1, 
      name: "Ahmad Rizki", 
      email: "ahmad.rizki@madrasah.sch.id",
      role: "Admin Pendaftaran",
      status: "Aktif",
      lastLogin: "2024-03-15 08:30"
    },
    { 
      id: 2, 
      name: "Siti Nurul", 
      email: "siti.nurul@madrasah.sch.id",
      role: "Admin Verifikasi",
      status: "Aktif",
      lastLogin: "2024-03-15 09:15"
    },
    { 
      id: 3, 
      name: "Muhammad Ali", 
      email: "muhammad.ali@madrasah.sch.id",
      role: "Admin Pendaftaran",
      status: "Tidak Aktif",
      lastLogin: "2024-03-14 16:45"
    },
    { 
      id: 4, 
      name: "Fatimah Azzahra", 
      email: "fatimah.azzahra@madrasah.sch.id",
      role: "Admin Verifikasi",
      status: "Aktif",
      lastLogin: "2024-03-15 10:20"
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/headmaster/dashboard')}>
            Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Data Admin</h1>
        </div>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Cari admin..."
            className="w-[300px]"
          />
          <Button>Export Data</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Login Terakhir</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin, index) => (
              <TableRow key={admin.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    admin.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell>{admin.lastLogin}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Detail
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default HeadmasterTeachers; 