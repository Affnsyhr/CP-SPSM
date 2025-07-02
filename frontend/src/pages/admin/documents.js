import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Sidebar } from "../../components/layout/sidebar";

export default function AdminDocuments() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/dokumen/all-admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Gagal mengambil data dokumen');
        const data = await res.json();
        setDocuments((data.data || []).map(doc => ({
          id: doc.dokumen_id,
          studentName: doc.nama_siswa,
          documentType: mapJenisDokumen(doc.jenis_dokumen),
          status: mapStatusVerifikasi(doc.status_verifikasi),
          uploadDate: doc.tanggal_upload ? new Date(doc.tanggal_upload).toLocaleDateString() : '',
          fileUrl: `/uploads/dokumen/${doc.nama_file}`,
          notes: doc.catatan || ''
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Mapping jenis dokumen ke label
  function mapJenisDokumen(jenis) {
    switch (jenis) {
      case 'akta_kelahiran': return 'Akte Kelahiran';
      case 'kartu_keluarga': return 'Kartu Keluarga';
      case 'rapor': return 'Rapor';
      case 'ijazah': return 'Ijazah';
      case 'foto': return 'Foto';
      default: return jenis;
    }
  }
  // Mapping status verifikasi ke frontend
  function mapStatusVerifikasi(status) {
    switch (status) {
      case 'diterima': return 'verified';
      case 'ditolak': return 'rejected';
      case 'menunggu': return 'pending';
      default: return status;
    }
  }
  // Mapping status frontend ke backend
  function reverseStatusVerifikasi(status) {
    switch (status) {
      case 'verified': return 'diterima';
      case 'rejected': return 'ditolak';
      case 'pending': return 'menunggu';
      default: return status;
    }
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowViewer(true);
  };

  const openConfirmDialog = (document, action) => {
    setSelectedDocument(document);
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const confirmDocumentVerification = () => {
    if (selectedDocument && pendingAction) {
      handleVerifyDocument(selectedDocument.id, pendingAction);
      setShowConfirmDialog(false);
    }
  };

  const handleVerifyDocument = async (documentId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/dokumen/${documentId}/verifikasi`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status_verifikasi: reverseStatusVerifikasi(status) })
      });
      if (!res.ok) throw new Error('Gagal memverifikasi dokumen');
      setDocuments(documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            status: status,
            notes: status === "verified" ? "Dokumen valid" : "Dokumen tidak valid"
          };
        }
        return doc;
      }));
      toast({
        title: status === "verified" ? "Dokumen Terverifikasi" : "Dokumen Ditolak",
        description: status === "verified"
          ? "Dokumen telah berhasil diverifikasi"
          : "Dokumen telah ditolak",
      });
    } catch (error) {
      toast({
        title: "Gagal Memverifikasi Dokumen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !documentType || doc.documentType === documentType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Kelola Dokumen</h1>
                <p className="text-muted-foreground">Verifikasi dokumen pendaftar</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Cari dokumen..."
                    className="h-10 rounded-md border px-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select 
                    className="h-10 rounded-md border px-4"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="">Semua Jenis</option>
                    <option value="Akte Kelahiran">Akte Kelahiran</option>
                    <option value="Kartu Keluarga">Kartu Keluarga</option>
                    <option value="Rapor">Rapor</option>
                    <option value="Ijazah">Ijazah</option>
                    <option value="Foto">Foto</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-4">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left">Nama Siswa</th>
                    <th className="p-4 text-left">Jenis Dokumen</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Tanggal Upload</th>
                    <th className="p-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b">
                      <td className="p-4">{doc.studentName}</td>
                      <td className="p-4">{doc.documentType}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-1 text-xs ${
                          doc.status === "verified" 
                            ? "bg-green-100 text-green-800"
                            : doc.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {doc.status === "verified" 
                            ? "Terverifikasi" 
                            : doc.status === "rejected"
                            ? "Ditolak"
                            : "Menunggu Verifikasi"}
                        </span>
                      </td>
                      <td className="p-4">{doc.uploadDate}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                          >
                            Lihat
                          </Button>
                          {doc.status === "pending" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openConfirmDialog(doc, "verified")}
                                className="bg-green-50 text-green-700 hover:bg-green-100"
                              >
                                Terima
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openConfirmDialog(doc, "rejected")}
                                className="bg-red-50 text-red-700 hover:bg-red-100"
                              >
                                Tolak
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
          {/* Dialog viewer dan konfirmasi tetap sama */}
          <Dialog open={showViewer} onOpenChange={setShowViewer}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Lihat Dokumen</DialogTitle>
              </DialogHeader>
              {selectedDocument && (
                <iframe
                  src={selectedDocument.fileUrl}
                  title="Dokumen Viewer"
                  width="100%"
                  height="500px"
                  style={{ border: 0 }}
                />
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Verifikasi Dokumen</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin {pendingAction === "verified" ? "menerima" : "menolak"} dokumen ini?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Batal
                </Button>
                <Button variant={pendingAction === "verified" ? "success" : "destructive"} onClick={confirmDocumentVerification}>
                  Ya, Ubah Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 
