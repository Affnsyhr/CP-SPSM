import React, { useState } from "react";
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

export default function AdminDocuments() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Mock data - replace with actual API calls
  const [documents, setDocuments] = useState([
    {
      id: 1,
      studentName: "Ahmad Fauzi",
      documentType: "Akte Kelahiran",
      status: "pending",
      uploadDate: "2024-03-15",
      fileUrl: "/documents/akte_kelahiran.pdf",
      notes: ""
    },
    {
      id: 2,
      studentName: "Siti Aminah",
      documentType: "Kartu Keluarga",
      status: "verified",
      uploadDate: "2024-03-14",
      fileUrl: "/documents/kartu_keluarga.pdf",
      notes: "Dokumen valid"
    },
    // Add more mock data as needed
  ]);

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
      // Here you would normally make an API call to update the document status
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
        description: "Terjadi kesalahan saat memverifikasi dokumen",
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
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kelola Dokumen</h1>
            <p className="text-muted-foreground">Verifikasi dokumen pendaftar</p>
          </div>
          <Link to="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Kembali ke Dashboard
            </Button>
          </Link>
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
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
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
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showViewer && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90vw] h-[90vh] bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDocument.documentType} - {selectedDocument.studentName}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowViewer(false)}
              >
                Tutup
              </Button>
            </div>
            <div className="h-[calc(90vh-8rem)]">
              <iframe
                src={selectedDocument.fileUrl}
                className="w-full h-full border rounded-lg"
                title="Document Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Verifikasi Dokumen</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin {pendingAction === "verified" ? "menerima" : "menolak"} dokumen {selectedDocument?.documentType} dari {selectedDocument?.studentName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Batal
            </Button>
            <Button 
              variant={pendingAction === "verified" ? "default" : "destructive"}
              onClick={confirmDocumentVerification}
            >
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 