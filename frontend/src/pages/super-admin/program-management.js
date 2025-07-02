import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Link } from "react-router-dom";
import { Sidebar, superAdminMenu } from "../../components/layout/sidebar";
import { useToast } from "../../hooks/use-toast";

const JENIS_PENDAFTAR_OPTIONS = [
  "reguler",
  "Prestasi akademik",
  "prestasi non akademik",
  "tahfiz"
];

const NAMA_PROGRAM_OPTIONS = [
  { value: "boarding School", label: "Boarding School" },
  { value: "Full day school", label: "Full Day School" }
];

export default function SuperAdminProgramManagement() {
  const { toast } = useToast();
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    nama_program: "",
    deskripsi: "",
    status_program: "aktif",
    kuota_siswa: "",
    jenis_pendaftar: []
  });

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch programs from API
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/program', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const result = await response.json();
      setPrograms(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data program",
        variant: "destructive"
      });
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
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
      nama_program: "",
      deskripsi: "",
      status_program: "aktif",
      kuota_siswa: "",
      jenis_pendaftar: []
    });
  };

  const handleJenisPendaftarChange = (jenis) => {
    setFormData((prev) => {
      const exists = prev.jenis_pendaftar.includes(jenis);
      return {
        ...prev,
        jenis_pendaftar: exists
          ? prev.jenis_pendaftar.filter((j) => j !== jenis)
          : [...prev.jenis_pendaftar, jenis]
      };
    });
  };

  const handleAddProgram = () => {
    setSelectedProgram(null);
    setFormData({
      nama_program: "",
      deskripsi: "",
      status_program: "aktif",
      kuota_siswa: "",
      jenis_pendaftar: []
    });
    setShowProgramDialog(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setFormData({
      nama_program: program.nama_program || "",
      deskripsi: program.deskripsi || "",
      status_program: program.status_program || "aktif",
      kuota_siswa: program.kuota_siswa !== undefined && program.kuota_siswa !== null ? String(program.kuota_siswa) : "",
      jenis_pendaftar: Array.isArray(program.jenis_pendaftar) ? program.jenis_pendaftar : []
    });
    setShowProgramDialog(true);
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const programData = {
        nama_program: formData.nama_program,
        deskripsi: formData.deskripsi,
        status_program: formData.status_program,
        kuota_siswa: parseInt(formData.kuota_siswa) || 0,
        jenis_pendaftar: formData.jenis_pendaftar
      };

      const url = selectedProgram 
        ? `/api/programs/${selectedProgram.program_id}`
        : '/api/programs';
      
      const method = selectedProgram ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(programData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save program');
      }

      toast({
        title: "Berhasil",
        description: selectedProgram ? "Program berhasil diperbarui" : "Program berhasil dibuat",
      });

      setShowProgramDialog(false);
      setSelectedProgram(null);
      resetForm();
      fetchPrograms(); // Refresh the list
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan program",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter programs based on search and status
  const filteredPrograms = Array.isArray(programs) ? programs.filter(program => {
    const matchesSearch = searchQuery === "" || 
      program.nama_program?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || program.status_program === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar menu={superAdminMenu} />
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Memuat data program...</p>
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manajemen Program & Jalur</h1>
              <p className="text-muted-foreground">Kelola program sekolah dan jalur pendaftaran</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari program atau jalur..."
                className="h-10 w-full rounded-md border px-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Programs Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Program Sekolah</h2>
              <Button onClick={handleAddProgram}>+ Tambah Program</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(filteredPrograms || []).length === 0 ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  Tidak ada data program
                </div>
              ) : (
                (filteredPrograms || []).map((program) => (
                  <div key={program.program_id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold">{program.nama_program}</h3>
                        <p className="text-sm text-muted-foreground">{program.deskripsi}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Kuota: {program.kuota_siswa ?? 0} siswa
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Jenis Pendaftar:
                            {Array.isArray(program.jenis_pendaftar) && program.jenis_pendaftar.length > 0 ? (
                              program.jenis_pendaftar.map((jenis) => (
                                <span key={jenis} className="inline-block bg-primary/10 text-primary rounded-full px-2 py-1 mx-1 text-xs">
                                  {jenis}
                                </span>
                              ))
                            ) : (
                              <span className="ml-2">-</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Status: {program.status_program}
                          </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={program.status_program === "aktif"} />
                      <Button variant="outline" size="sm" onClick={() => handleEditProgram(program)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Program Dialog */}
          <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedProgram ? "Edit Program" : "Tambah Program Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProgramSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nama_program">Nama Program</Label>
                    <select
                      id="nama_program"
                      name="nama_program"
                      value={formData.nama_program}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded p-2"
                    >
                      <option value="">Pilih Program</option>
                      {NAMA_PROGRAM_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi program"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kuota_siswa">Kuota Siswa</Label>
                    <Input
                      id="kuota_siswa"
                      name="kuota_siswa"
                      type="number"
                      value={formData.kuota_siswa}
                      onChange={handleInputChange}
                      placeholder="Masukkan kuota siswa"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Jenis Pendaftar</Label>
                    <div className="flex flex-wrap gap-4">
                      {JENIS_PENDAFTAR_OPTIONS.map((jenis) => (
                        <label key={jenis} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.jenis_pendaftar.includes(jenis)}
                            onChange={() => handleJenisPendaftarChange(jenis)}
                          />
                          <span>{jenis}</span>
                        </label>
                      ))}
                    </div>
                </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status_program">Status</Label>
                    <Select value={formData.status_program} onValueChange={(value) => setFormData(prev => ({ ...prev, status_program: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>
              <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowProgramDialog(false)} disabled={submitting}>
                  Batal
                </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan"}
                  </Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 