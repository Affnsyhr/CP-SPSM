import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useNavigate } from 'react-router-dom';

function HeadmasterStudents() {
  const navigate = useNavigate();
  const [programFilter, setProgramFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API data
  const students = [
    { 
      id: 1, 
      name: "Ahmad Rizki", 
      program: "Boarding School",
      status: "Menunggu Verifikasi",
      registrationDate: "2024-03-15",
      parentName: "Budi Santoso",
      phone: "081234567890"
    },
    { 
      id: 2, 
      name: "Siti Nurul", 
      program: "Full Day School",
      status: "Diterima",
      registrationDate: "2024-03-14",
      parentName: "Ahmad Hidayat",
      phone: "081234567891"
    },
    { 
      id: 3, 
      name: "Muhammad Ali", 
      program: "Boarding School",
      status: "Ditolak",
      registrationDate: "2024-03-13",
      parentName: "Rudi Hartono",
      phone: "081234567892"
    },
    { 
      id: 4, 
      name: "Fatimah Azzahra", 
      program: "Full Day School",
      status: "Menunggu Verifikasi",
      registrationDate: "2024-03-12",
      parentName: "Hasan Basri",
      phone: "081234567893"
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesProgram = programFilter === 'all' || student.program === programFilter;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/headmaster/dashboard')}>
            Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Data Pendaftar Siswa Baru</h1>
        </div>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Cari nama siswa atau wali..."
            className="w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Program</SelectItem>
              <SelectItem value="Boarding School">Boarding School</SelectItem>
              <SelectItem value="Full Day School">Full Day School</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Data</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead>Nama Wali</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                    student.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status}
                  </span>
                </TableCell>
                <TableCell>{student.registrationDate}</TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>{student.phone}</TableCell>
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

export default HeadmasterStudents; 