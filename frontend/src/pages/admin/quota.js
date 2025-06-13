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
import { Progress } from "../../components/ui/progress";

export default function AdminQuota() {
  const [isAddingQuota, setIsAddingQuota] = useState(false);
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotaToDelete, setQuotaToDelete] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("boarding");
  const [selectedYear, setSelectedYear] = useState("2024/2025");
  const { toast } = useToast();

  const [newQuota, setNewQuota] = useState({
    academicYear: "",
    totalQuota: 0,
    programs: {
      boarding: {
        total: 0,
        paths: {
          reguler: { quota: 0, filled: 0 },
          prestasiAkademik: { quota: 0, filled: 0 },
          prestasiNonAkademik: { quota: 0, filled: 0 },
          tahfizh: { quota: 0, filled: 0 }
        }
      },
      fullDay: {
        total: 0,
        paths: {
          reguler: { quota: 0, filled: 0 },
          prestasiAkademik: { quota: 0, filled: 0 },
          prestasiNonAkademik: { quota: 0, filled: 0 },
          tahfizh: { quota: 0, filled: 0 }
        }
      }
    }
  });

  // Simulasi data kuota
  const [quotas, setQuotas] = useState([
    {
      id: 1,
      academicYear: "2024/2025",
      totalQuota: 200,
      programs: {
        boarding: {
          total: 100,
          paths: {
            reguler: { quota: 40, filled: 35 },
            prestasiAkademik: { quota: 20, filled: 15 },
            prestasiNonAkademik: { quota: 20, filled: 18 },
            tahfizh: { quota: 20, filled: 20 }
          }
        },
        fullDay: {
          total: 100,
          paths: {
            reguler: { quota: 40, filled: 30 },
            prestasiAkademik: { quota: 20, filled: 12 },
            prestasiNonAkademik: { quota: 20, filled: 15 },
            tahfizh: { quota: 20, filled: 18 }
          }
        }
      }
    }
  ]);

  const handleAddQuota = () => {
    // Validasi total kuota
    const totalProgramQuota = newQuota.programs.boarding.total + newQuota.programs.fullDay.total;
    if (totalProgramQuota > newQuota.totalQuota) {
      toast({
        title: "Error",
        description: "Total kuota program tidak boleh melebihi total kuota keseluruhan",
        variant: "destructive",
      });
      return;
    }

    // Validasi kuota jalur
    const validatePathQuota = (program) => {
      const pathTotal = Object.values(program.paths).reduce((sum, path) => sum + path.quota, 0);
      return pathTotal <= program.total;
    };

    if (!validatePathQuota(newQuota.programs.boarding) || !validatePathQuota(newQuota.programs.fullDay)) {
      toast({
        title: "Error",
        description: "Total kuota jalur tidak boleh melebihi kuota program",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...quotas.map(q => q.id)) + 1;
    setQuotas([...quotas, { ...newQuota, id: newId }]);
    toast({
      title: "Kuota berhasil ditambahkan",
      description: "Pengaturan kuota baru telah ditambahkan ke sistem",
    });
    setIsAddingQuota(false);
    resetForm();
  };

  const handleEditClick = (quota) => {
    setEditingQuotaId(quota.id);
    setNewQuota(quota);
    setIsEditingQuota(true);
  };

  const handleEditSave = () => {
    // Validasi yang sama seperti handleAddQuota
    const totalProgramQuota = newQuota.programs.boarding.total + newQuota.programs.fullDay.total;
    if (totalProgramQuota > newQuota.totalQuota) {
      toast({
        title: "Error",
        description: "Total kuota program tidak boleh melebihi total kuota keseluruhan",
        variant: "destructive",
      });
      return;
    }

    setQuotas(quotas.map(quota => 
      quota.id === editingQuotaId 
        ? { ...quota, ...newQuota }
        : quota
    ));

    toast({
      title: "Kuota berhasil diperbarui",
      description: "Perubahan telah disimpan ke sistem",
    });

    setIsEditingQuota(false);
    setEditingQuotaId(null);
    resetForm();
  };

  const handleDeleteClick = (quota) => {
    setQuotaToDelete(quota);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (quotaToDelete) {
      setQuotas(quotas.filter(quota => quota.id !== quotaToDelete.id));
      toast({
        title: "Kuota berhasil dihapus",
        description: "Pengaturan kuota telah dihapus dari sistem",
      });
      setDeleteDialogOpen(false);
      setQuotaToDelete(null);
    }
  };

  const resetForm = () => {
    setNewQuota({
      academicYear: "",
      totalQuota: 0,
      programs: {
        boarding: {
          total: 0,
          paths: {
            reguler: { quota: 0, filled: 0 },
            prestasiAkademik: { quota: 0, filled: 0 },
            prestasiNonAkademik: { quota: 0, filled: 0 },
            tahfizh: { quota: 0, filled: 0 }
          }
        },
        fullDay: {
          total: 0,
          paths: {
            reguler: { quota: 0, filled: 0 },
            prestasiAkademik: { quota: 0, filled: 0 },
            prestasiNonAkademik: { quota: 0, filled: 0 },
            tahfizh: { quota: 0, filled: 0 }
          }
        }
      }
    });
  };

  const handleCancel = () => {
    setIsAddingQuota(false);
    setIsEditingQuota(false);
    setEditingQuotaId(null);
    resetForm();
  };

  const getQuotaProgress = (filled, quota) => {
    const percentage = (filled / quota) * 100;
    return {
      percentage,
      color: percentage >= 80 ? "bg-red-500" : percentage >= 60 ? "bg-yellow-500" : "bg-green-500"
    };
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Kuota Siswa</h1>
          <p className="text-muted-foreground">Atur kuota penerimaan siswa baru</p>
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

      <div className="mb-6 flex items-center gap-4">
        <Button onClick={() => setIsAddingQuota(true)}>
          Tambah Kuota
        </Button>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Tahun Ajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024/2025">2024/2025</SelectItem>
            <SelectItem value="2023/2024">2023/2024</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="boarding">Boarding School</SelectItem>
            <SelectItem value="fullDay">Full Day School</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(isAddingQuota || isEditingQuota) && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditingQuota ? "Edit Kuota" : "Tambah Kuota Baru"}
          </h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Tahun Ajaran</Label>
              <Input
                id="academicYear"
                placeholder="Contoh: 2024/2025"
                value={newQuota.academicYear}
                onChange={(e) => setNewQuota({ ...newQuota, academicYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalQuota">Total Kuota Keseluruhan</Label>
              <Input
                id="totalQuota"
                type="number"
                value={newQuota.totalQuota}
                onChange={(e) => setNewQuota({ ...newQuota, totalQuota: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            {/* Boarding School Quota */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Boarding School</h3>
              <div className="space-y-2">
                <Label>Total Kuota Boarding</Label>
                <Input
                  type="number"
                  value={newQuota.programs.boarding.total}
                  onChange={(e) => setNewQuota({
                    ...newQuota,
                    programs: {
                      ...newQuota.programs,
                      boarding: {
                        ...newQuota.programs.boarding,
                        total: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kuota Reguler</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.boarding.paths.reguler.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        boarding: {
                          ...newQuota.programs.boarding,
                          paths: {
                            ...newQuota.programs.boarding.paths,
                            reguler: {
                              ...newQuota.programs.boarding.paths.reguler,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Prestasi Akademik</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.boarding.paths.prestasiAkademik.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        boarding: {
                          ...newQuota.programs.boarding,
                          paths: {
                            ...newQuota.programs.boarding.paths,
                            prestasiAkademik: {
                              ...newQuota.programs.boarding.paths.prestasiAkademik,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Prestasi Non Akademik</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.boarding.paths.prestasiNonAkademik.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        boarding: {
                          ...newQuota.programs.boarding,
                          paths: {
                            ...newQuota.programs.boarding.paths,
                            prestasiNonAkademik: {
                              ...newQuota.programs.boarding.paths.prestasiNonAkademik,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Tahfizh</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.boarding.paths.tahfizh.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        boarding: {
                          ...newQuota.programs.boarding,
                          paths: {
                            ...newQuota.programs.boarding.paths,
                            tahfizh: {
                              ...newQuota.programs.boarding.paths.tahfizh,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Full Day School Quota */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Full Day School</h3>
              <div className="space-y-2">
                <Label>Total Kuota Full Day</Label>
                <Input
                  type="number"
                  value={newQuota.programs.fullDay.total}
                  onChange={(e) => setNewQuota({
                    ...newQuota,
                    programs: {
                      ...newQuota.programs,
                      fullDay: {
                        ...newQuota.programs.fullDay,
                        total: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kuota Reguler</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.fullDay.paths.reguler.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        fullDay: {
                          ...newQuota.programs.fullDay,
                          paths: {
                            ...newQuota.programs.fullDay.paths,
                            reguler: {
                              ...newQuota.programs.fullDay.paths.reguler,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Prestasi Akademik</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.fullDay.paths.prestasiAkademik.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        fullDay: {
                          ...newQuota.programs.fullDay,
                          paths: {
                            ...newQuota.programs.fullDay.paths,
                            prestasiAkademik: {
                              ...newQuota.programs.fullDay.paths.prestasiAkademik,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Prestasi Non Akademik</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.fullDay.paths.prestasiNonAkademik.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        fullDay: {
                          ...newQuota.programs.fullDay,
                          paths: {
                            ...newQuota.programs.fullDay.paths,
                            prestasiNonAkademik: {
                              ...newQuota.programs.fullDay.paths.prestasiNonAkademik,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Tahfizh</Label>
                  <Input
                    type="number"
                    value={newQuota.programs.fullDay.paths.tahfizh.quota}
                    onChange={(e) => setNewQuota({
                      ...newQuota,
                      programs: {
                        ...newQuota.programs,
                        fullDay: {
                          ...newQuota.programs.fullDay,
                          paths: {
                            ...newQuota.programs.fullDay.paths,
                            tahfizh: {
                              ...newQuota.programs.fullDay.paths.tahfizh,
                              quota: parseInt(e.target.value) || 0
                            }
                          }
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
              <Button onClick={isEditingQuota ? handleEditSave : handleAddQuota}>
                {isEditingQuota ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Pengaturan Kuota</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengaturan kuota ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {quotaToDelete && (
            <div className="py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Detail Kuota:</p>
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tahun Ajaran:</span> {quotaToDelete.academicYear}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Kuota:</span> {quotaToDelete.totalQuota}
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
                setQuotaToDelete(null);
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
        <h2 className="text-xl font-semibold">Daftar Kuota</h2>
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Tahun Ajaran</th>
                <th className="p-4 text-left font-medium">Total Kuota</th>
                <th className="p-4 text-left font-medium">Program</th>
                <th className="p-4 text-left font-medium">Jalur</th>
                <th className="p-4 text-left font-medium">Kuota</th>
                <th className="p-4 text-left font-medium">Terisi</th>
                <th className="p-4 text-left font-medium">Progress</th>
                <th className="p-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quotas.map((quota) => (
                <>
                  {/* Boarding School Rows */}
                  <tr key={`${quota.id}-boarding`} className="border-b">
                    <td className="p-4" rowSpan="8">{quota.academicYear}</td>
                    <td className="p-4" rowSpan="8">{quota.totalQuota}</td>
                    <td className="p-4 font-medium" rowSpan="4">Boarding School</td>
                    <td className="p-4">Reguler</td>
                    <td className="p-4">{quota.programs.boarding.paths.reguler.quota}</td>
                    <td className="p-4">{quota.programs.boarding.paths.reguler.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.boarding.paths.reguler.filled / quota.programs.boarding.paths.reguler.quota) * 100}
                          className={getQuotaProgress(quota.programs.boarding.paths.reguler.filled, quota.programs.boarding.paths.reguler.quota).color}
                        />
                      </div>
                    </td>
                    <td className="p-4" rowSpan="8">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleEditClick(quota)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(quota)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Prestasi Akademik</td>
                    <td className="p-4">{quota.programs.boarding.paths.prestasiAkademik.quota}</td>
                    <td className="p-4">{quota.programs.boarding.paths.prestasiAkademik.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.boarding.paths.prestasiAkademik.filled / quota.programs.boarding.paths.prestasiAkademik.quota) * 100}
                          className={getQuotaProgress(quota.programs.boarding.paths.prestasiAkademik.filled, quota.programs.boarding.paths.prestasiAkademik.quota).color}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Prestasi Non Akademik</td>
                    <td className="p-4">{quota.programs.boarding.paths.prestasiNonAkademik.quota}</td>
                    <td className="p-4">{quota.programs.boarding.paths.prestasiNonAkademik.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.boarding.paths.prestasiNonAkademik.filled / quota.programs.boarding.paths.prestasiNonAkademik.quota) * 100}
                          className={getQuotaProgress(quota.programs.boarding.paths.prestasiNonAkademik.filled, quota.programs.boarding.paths.prestasiNonAkademik.quota).color}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Tahfizh</td>
                    <td className="p-4">{quota.programs.boarding.paths.tahfizh.quota}</td>
                    <td className="p-4">{quota.programs.boarding.paths.tahfizh.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.boarding.paths.tahfizh.filled / quota.programs.boarding.paths.tahfizh.quota) * 100}
                          className={getQuotaProgress(quota.programs.boarding.paths.tahfizh.filled, quota.programs.boarding.paths.tahfizh.quota).color}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Full Day School Rows */}
                  <tr className="border-b">
                    <td className="p-4 font-medium" rowSpan="4">Full Day School</td>
                    <td className="p-4">Reguler</td>
                    <td className="p-4">{quota.programs.fullDay.paths.reguler.quota}</td>
                    <td className="p-4">{quota.programs.fullDay.paths.reguler.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.fullDay.paths.reguler.filled / quota.programs.fullDay.paths.reguler.quota) * 100}
                          className={getQuotaProgress(quota.programs.fullDay.paths.reguler.filled, quota.programs.fullDay.paths.reguler.quota).color}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Prestasi Akademik</td>
                    <td className="p-4">{quota.programs.fullDay.paths.prestasiAkademik.quota}</td>
                    <td className="p-4">{quota.programs.fullDay.paths.prestasiAkademik.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.fullDay.paths.prestasiAkademik.filled / quota.programs.fullDay.paths.prestasiAkademik.quota) * 100}
                          className={getQuotaProgress(quota.programs.fullDay.paths.prestasiAkademik.filled, quota.programs.fullDay.paths.prestasiAkademik.quota).color}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Prestasi Non Akademik</td>
                    <td className="p-4">{quota.programs.fullDay.paths.prestasiNonAkademik.quota}</td>
                    <td className="p-4">{quota.programs.fullDay.paths.prestasiNonAkademik.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.fullDay.paths.prestasiNonAkademik.filled / quota.programs.fullDay.paths.prestasiNonAkademik.quota) * 100}
                          className={getQuotaProgress(quota.programs.fullDay.paths.prestasiNonAkademik.filled, quota.programs.fullDay.paths.prestasiNonAkademik.quota).color}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Tahfizh</td>
                    <td className="p-4">{quota.programs.fullDay.paths.tahfizh.quota}</td>
                    <td className="p-4">{quota.programs.fullDay.paths.tahfizh.filled}</td>
                    <td className="p-4">
                      <div className="w-full">
                        <Progress 
                          value={(quota.programs.fullDay.paths.tahfizh.filled / quota.programs.fullDay.paths.tahfizh.quota) * 100}
                          className={getQuotaProgress(quota.programs.fullDay.paths.tahfizh.filled, quota.programs.fullDay.paths.tahfizh.quota).color}
                        />
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 