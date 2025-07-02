import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";
import { Sidebar, waliMenu } from "../../components/layout/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";

export default function DocumentsPage() {
  const { toast } = useToast();
  const [isRegistrationPeriod] = useState(true); // In real app, this would be fetched from API/backend
  const fileInputRefs = useRef({});
  const [pendaftaranId, setPendaftaranId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const allowedJenisDokumen = [
    { key: 'akta_kelahiran', label: 'Akte Kelahiran' },
    { key: 'kartu_keluarga', label: 'Kartu Keluarga' },
    { key: 'ijazah', label: 'Ijazah' },
    { key: 'foto', label: 'Foto' },
    { key: 'lainnya', label: 'Rapor' },
  ];

  const getToken = () => {
    return localStorage.getItem('token') || (JSON.parse(localStorage.getItem('user'))?.token);
  };

  // Fetch pendaftaran dan dokumen saat mount
  useEffect(() => {
    const fetchPendaftaranAndDokumen = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch daftar pendaftaran user
        const resPendaftaran = await fetch('/api/pendaftaran', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const dataPendaftaran = await resPendaftaran.json();
        if (!resPendaftaran.ok || !dataPendaftaran.data || dataPendaftaran.data.length === 0) {
          setIsLoading(false);
          toast({ title: 'Belum ada pendaftaran', description: 'Silakan daftar siswa terlebih dahulu.' });
          return;
        }
        // Ambil pendaftaran_id terbaru
        const pendaftaran = dataPendaftaran.data[0];
        setPendaftaranId(pendaftaran.pendaftaran_id);

        // 2. Fetch dokumen
        const resDokumen = await fetch(`/api/dokumen/${pendaftaran.pendaftaran_id}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const dataDokumen = await resDokumen.json();
        if (resDokumen.ok && dataDokumen.data) {
          setDocuments(dataDokumen.data);
        } else {
          setDocuments([]);
        }
      } catch (error) {
        toast({ title: 'Gagal memuat dokumen', description: error.message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendaftaranAndDokumen();
    // eslint-disable-next-line
  }, []);

  const handleViewDocument = (document) => {
    if (document.nama_file) {
      window.open(`/uploads/dokumen/${document.nama_file}`, '_blank');
    } else {
      toast({ title: 'Dokumen belum diunggah' });
    }
  };

  const handleReplaceDocument = async (documentId, file) => {
    if (!pendaftaranId) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/dokumen/${documentId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Dokumen berhasil diganti', description: 'Dokumen baru akan diverifikasi oleh admin.' });
        // Refresh dokumen
        const resDokumen = await fetch(`/api/dokumen/${pendaftaranId}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const dataDokumen = await resDokumen.json();
        setDocuments(dataDokumen.data || []);
      } else {
        toast({ title: 'Gagal mengganti dokumen', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Gagal mengganti dokumen', description: error.message, variant: 'destructive' });
    }
  };

  // Tambahkan fungsi untuk upload dokumen baru (POST)
  const handleUploadNewDocument = async (jenisDokumen, file) => {
    if (!pendaftaranId) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pendaftaran_id', pendaftaranId);
      formData.append('jenis_dokumen', jenisDokumen);
      const res = await fetch('/api/dokumen', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Dokumen berhasil diunggah', description: 'Dokumen akan diverifikasi oleh admin.' });
        // Refresh dokumen
        const resDokumen = await fetch(`/api/dokumen/${pendaftaranId}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const dataDokumen = await resDokumen.json();
        setDocuments(dataDokumen.data || []);
      } else {
        toast({ title: 'Gagal mengunggah dokumen', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Gagal mengunggah dokumen', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!pendaftaranId) return;
    try {
      const res = await fetch(`/api/dokumen/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Dokumen berhasil dihapus', description: 'Silakan unggah dokumen baru.' });
        // Refresh dokumen
        const resDokumen = await fetch(`/api/dokumen/${pendaftaranId}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const dataDokumen = await resDokumen.json();
        setDocuments(dataDokumen.data || []);
      } else {
        toast({ title: 'Gagal menghapus dokumen', description: data.message || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Gagal menghapus dokumen', description: error.message, variant: 'destructive' });
    }
  };

  // Modifikasi handleFileChange agar membedakan PUT/POST
  const handleFileChange = (dokumenId, event, jenisDokumen) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (dokumenId) {
      handleReplaceDocument(dokumenId, file);
    } else {
      handleUploadNewDocument(jenisDokumen, file);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar menu={waliMenu} />
      <div className="flex-1 flex flex-col">
        <div className="container py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dokumen Saya</h1>
                <p className="text-muted-foreground">
                  Kelola dokumen yang telah Anda unggah
                </p>
              </div>
            </div>
          </div>

          {!isRegistrationPeriod && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
              <p className="font-medium">Periode pendaftaran telah berakhir</p>
              <p className="text-sm">Anda tidak dapat mengubah dokumen yang telah diunggah</p>
            </div>
          )}

          <div className="grid gap-6">
            {allowedJenisDokumen.map((jenis) => {
              // Cari dokumen yang sudah pernah diupload untuk jenis ini
              const document = documents.find((d) => d.jenis_dokumen === jenis.key) || {};
              return (
              <div
                  key={jenis.key}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                      <h3 className="font-semibold">{jenis.label}</h3>
                    <p className="text-sm text-muted-foreground">
                        {document.nama_file ? (
                        <>
                            Diunggah pada: {document.tanggal_upload ? document.tanggal_upload.slice(0, 10) : '-'}
                          <br />
                            Nama file: {document.nama_file}
                        </>
                      ) : (
                        "Belum diunggah"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                      {document.status_verifikasi === 'terverifikasi' || document.status_verifikasi === 'diterima' ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Terverifikasi
                      </span>
                      ) : document.status_verifikasi === 'menunggu' ? (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        Menunggu Verifikasi
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                        Belum Diunggah
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                    {document.nama_file ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                      >
                        Lihat Dokumen
                      </Button>
                        {document.status_verifikasi !== 'terverifikasi' && (
                        <>
                          <input
                            type="file"
                              style={{ display: 'none' }}
                              ref={el => fileInputRefs.current[jenis.key] = el}
                              onChange={e => handleFileChange(document.dokumen_id, e, jenis.key)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                              onClick={() => fileInputRefs.current[jenis.key] && fileInputRefs.current[jenis.key].click()}
                          >
                            Ganti Dokumen
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                              onClick={() => {
                                setSelectedDocumentId(document.dokumen_id);
                                setShowDeleteDialog(true);
                              }}
                          >
                            Hapus
                          </Button>
                        </>
                      )}
                    </>
                    ) : (
                    <>
                      <input
                        type="file"
                          style={{ display: 'none' }}
                          ref={el => fileInputRefs.current[jenis.key] = el}
                          onChange={e => handleFileChange(document.dokumen_id, e, jenis.key)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                          onClick={() => fileInputRefs.current[jenis.key] && fileInputRefs.current[jenis.key].click()}
                      >
                        Unggah Dokumen
                      </Button>
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border bg-muted/50 p-4">
            <h4 className="font-medium">Catatan:</h4>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>Dokumen harus dalam format PDF</li>
              <li>Ukuran maksimal setiap file adalah 2MB</li>
              <li>Dokumen yang sudah terverifikasi tidak dapat dihapus atau diganti</li>
              <li>Pastikan dokumen yang Anda unggah jelas dan sesuai</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tambahkan dialog konfirmasi hapus dokumen */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Dokumen</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus file ini?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteDocument(selectedDocumentId);
                setShowDeleteDialog(false);
              }}
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}