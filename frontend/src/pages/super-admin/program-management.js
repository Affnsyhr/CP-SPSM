import React, { useState } from "react";
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

export default function ProgramManagement() {
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [showPathDialog, setShowPathDialog] = useState(false);
  const [showCombinationDialog, setShowCombinationDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - replace with actual API data
  const programs = [
    {
      id: 1,
      name: "Boarding School",
      description: "Program pendidikan dengan asrama",
      status: "active",
      capacity: 200,
      fee: 15000000,
      paths: ["reguler", "prestasi-akademik", "tahfiz"]
    },
    {
      id: 2,
      name: "Full Day School",
      description: "Program pendidikan sehari penuh",
      status: "active",
      capacity: 300,
      fee: 10000000,
      paths: ["reguler", "prestasi-non-akademik"]
    }
  ];

  const paths = [
    {
      id: 1,
      name: "Reguler",
      description: "Jalur pendaftaran reguler",
      status: "active",
      requirements: [
        "Akte Kelahiran",
        "Kartu Keluarga",
        "Rapor"
      ]
    },
    {
      id: 2,
      name: "Prestasi Akademik",
      description: "Jalur pendaftaran untuk siswa berprestasi akademik",
      status: "active",
      requirements: [
        "Akte Kelahiran",
        "Kartu Keluarga",
        "Rapor",
        "Sertifikat Prestasi Akademik"
      ]
    },
    {
      id: 3,
      name: "Prestasi Non-Akademik",
      description: "Jalur pendaftaran untuk siswa berprestasi non-akademik",
      status: "active",
      requirements: [
        "Akte Kelahiran",
        "Kartu Keluarga",
        "Rapor",
        "Sertifikat Prestasi Non-Akademik"
      ]
    },
    {
      id: 4,
      name: "Tahfiz",
      description: "Jalur pendaftaran khusus tahfiz",
      status: "active",
      requirements: [
        "Akte Kelahiran",
        "Kartu Keluarga",
        "Rapor",
        "Sertifikat Tahfiz"
      ]
    }
  ];

  const handleAddProgram = () => {
    setSelectedProgram(null);
    setShowProgramDialog(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setShowProgramDialog(true);
  };

  const handleAddPath = () => {
    setSelectedPath(null);
    setShowPathDialog(true);
  };

  const handleEditPath = (path) => {
    setSelectedPath(path);
    setShowPathDialog(true);
  };

  const handleAddCombination = () => {
    setShowCombinationDialog(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Program & Jalur</h1>
          <p className="text-muted-foreground">Kelola program sekolah dan jalur pendaftaran</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/super-admin/dashboard" className="flex items-center gap-2">
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
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
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
          {programs.map((program) => (
            <div key={program.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{program.name}</h3>
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={program.status === "active"} />
                  <Button variant="outline" size="sm" onClick={() => handleEditProgram(program)}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paths Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Jalur Pendaftaran</h2>
          <Button onClick={handleAddPath}>+ Tambah Jalur</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {paths.map((path) => (
            <div key={path.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{path.name}</h3>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={path.status === "active"} />
                  <Button variant="outline" size="sm" onClick={() => handleEditPath(path)}>
                    Edit
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Persyaratan:</h4>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {path.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combinations Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Kombinasi Program & Jalur</h2>
          <Button onClick={handleAddCombination}>+ Tambah Kombinasi</Button>
        </div>
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Program</th>
                  <th className="p-4 text-left">Jalur Tersedia</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b">
                    <td className="p-4">{program.name}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {program.paths.map((pathId) => {
                          const path = paths.find((p) => p.id === pathId);
                          return path ? (
                            <span
                              key={path.id}
                              className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                            >
                              {path.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        Aktif
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Program Dialog */}
      <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProgram ? "Edit Program" : "Tambah Program"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Program</Label>
              <Input id="name" defaultValue={selectedProgram?.name} />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" defaultValue={selectedProgram?.description} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="status" defaultChecked={selectedProgram?.status === "active"} />
              <Label htmlFor="status">Status Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgramDialog(false)}>
              Batal
            </Button>
            <Button>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Path Dialog */}
      <Dialog open={showPathDialog} onOpenChange={setShowPathDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPath ? "Edit Jalur" : "Tambah Jalur"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="path-name">Nama Jalur</Label>
              <Input id="path-name" defaultValue={selectedPath?.name} />
            </div>
            <div>
              <Label htmlFor="path-description">Deskripsi</Label>
              <Textarea id="path-description" defaultValue={selectedPath?.description} />
            </div>
            <div>
              <Label>Persyaratan</Label>
              <div className="space-y-2">
                {selectedPath?.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input defaultValue={req} />
                    <Button variant="outline" size="sm">Hapus</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm">+ Tambah Persyaratan</Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="path-status" defaultChecked={selectedPath?.status === "active"} />
              <Label htmlFor="path-status">Status Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPathDialog(false)}>
              Batal
            </Button>
            <Button>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Combination Dialog */}
      <Dialog open={showCombinationDialog} onOpenChange={setShowCombinationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kombinasi Program & Jalur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="program">Program</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Jalur Pendaftaran</Label>
              <div className="space-y-2">
                {paths.map((path) => (
                  <div key={path.id} className="flex items-center gap-2">
                    <Switch id={`path-${path.id}`} />
                    <Label htmlFor={`path-${path.id}`}>{path.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCombinationDialog(false)}>
              Batal
            </Button>
            <Button>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 