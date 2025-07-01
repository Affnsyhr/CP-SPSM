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
import { Progress } from "../../components/ui/progress";
import { Sidebar } from "../../components/layout/sidebar";

export default function AdminQuota() {
  const [isAddingQuota, setIsAddingQuota] = useState(false);
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotaToDelete, setQuotaToDelete] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("boarding");
  const [selectedYear, setSelectedYear] = useState("2024/2025");
  const { toast } = useToast();
  const [jalurList, setJalurList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(0);

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

  const getToken = () => localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);

  const fetchJalur = async () => {
    try {
      const res = await fetch('/api/program/jalur', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setJalurList(data.data);
      } else {
        setJalurList([]);
      }
    } catch (err) {
      setJalurList([]);
    }
  };

  useEffect(() => {
    fetchJalur();
  }, []);

  const handleEdit = (id, currentValue) => {
    setEditId(id);
    setEditValue(currentValue);
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/program/jalur/${id}/kuota`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ kuota_jalur: editValue })
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Kuota jalur berhasil diupdate' });
        setEditId(null);
        fetchJalur();
      } else {
        toast({ title: 'Gagal update kuota jalur', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Gagal update kuota jalur', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Kelola Kuota</h1>
              <p className="text-muted-foreground">Atur kuota siswa baru</p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4"></div>

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
                  <Button variant="outline" onClick={() => setIsAddingQuota(false)}>
                    Batal
                  </Button>
                  <Button onClick={isEditingQuota ? () => {
                    // Implementasi handleEditSave
                  } : () => {
                    // Implementasi handleAddQuota
                  }}>
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
                  onClick={() => {
                    // Implementasi handleDeleteConfirm
                  }}
                >
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Daftar Kuota Jalur</h2>
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Program</th>
                    <th className="p-4 text-left font-medium">Jalur</th>
                    <th className="p-4 text-left font-medium">Kuota Jalur</th>
                    <th className="p-4 text-left font-medium">Terisi</th>
                    <th className="p-4 text-left font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jalurList.map(jalur => (
                    <tr key={jalur.id} className="border-b">
                      <td className="p-4">{jalur.nama_program || jalur.program_id}</td>
                      <td className="p-4">{jalur.jenis_pendaftar}</td>
                      <td className="p-4">
                        {editId === jalur.id ? (
                          <Input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(Number(e.target.value))}
                            className="w-24"
                          />
                        ) : (
                          jalur.kuota_jalur ?? '-'
                        )}
                      </td>
                      <td className="p-4">{jalur.filled ?? 0}</td>
                      <td className="p-4">
                        {editId === jalur.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSave(jalur.id)}>
                              Simpan
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                              Batal
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" onClick={() => handleEdit(jalur.id, jalur.kuota_jalur ?? 0)}>
                            Edit
                          </Button>
                        )}
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