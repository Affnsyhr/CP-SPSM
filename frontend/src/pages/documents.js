import React, { useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

export default function DocumentsPage() {
  const { toast } = useToast();
  const [isRegistrationPeriod] = useState(true); // In real app, this would be fetched from API/backend
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: 'Akte Kelahiran',
      fileName: 'akte_kelahiran.pdf',
      uploadDate: '2024-03-15',
      status: 'menunggu',
      fileUrl: '/documents/akte_kelahiran.pdf'
    },
    {
      id: 2,
      type: 'Kartu Keluarga',
      fileName: 'kartu_keluarga.pdf',
      uploadDate: '2024-03-15',
      status: 'terverifikasi',
      fileUrl: '/documents/kartu_keluarga.pdf'
    },
    {
      id: 3,
      type: 'Rapor',
      fileName: 'rapor.pdf',
      uploadDate: '2024-03-15',
      status: 'menunggu',
      fileUrl: '/documents/rapor.pdf'
    }
  ]);

  const handleViewDocument = (document) => {
    // Open document in new tab
    window.open(document.fileUrl, '_blank');
  };

  const handleReplaceDocument = async (documentId, file) => {
    if (!isRegistrationPeriod) {
      toast({
        title: "Tidak dapat mengganti dokumen",
        description: "Periode pendaftaran telah berakhir",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would normally upload the file to your server
      // For demo purposes, we'll just update the state
      setDocuments(documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'menunggu'
          };
        }
        return doc;
      }));

      toast({
        title: "Dokumen berhasil diganti",
        description: "Dokumen baru akan diverifikasi oleh admin",
      });
    } catch (error) {
      toast({
        title: "Gagal mengganti dokumen",
        description: "Terjadi kesalahan saat mengganti dokumen",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!isRegistrationPeriod) {
      toast({
        title: "Tidak dapat menghapus dokumen",
        description: "Periode pendaftaran telah berakhir",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would normally delete the file from your server
      // For demo purposes, we'll just update the state
      setDocuments(documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            fileName: null,
            uploadDate: null,
            status: 'belum'
          };
        }
        return doc;
      }));

      toast({
        title: "Dokumen berhasil dihapus",
        description: "Silakan unggah dokumen baru",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus dokumen",
        description: "Terjadi kesalahan saat menghapus dokumen",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (documentId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleReplaceDocument(documentId, file);
    }
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dokumen Saya</h1>
            <p className="text-muted-foreground">
              Kelola dokumen yang telah Anda unggah
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
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
            </Button>
          </Link>
        </div>
      </div>

      {!isRegistrationPeriod && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <p className="font-medium">Periode pendaftaran telah berakhir</p>
          <p className="text-sm">Anda tidak dapat mengubah dokumen yang telah diunggah</p>
        </div>
      )}

      <div className="grid gap-6">
        {documents.map((document) => (
          <div
            key={document.id}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{document.type}</h3>
                <p className="text-sm text-muted-foreground">
                  {document.fileName ? (
                    <>
                      Diunggah pada: {document.uploadDate}
                      <br />
                      Nama file: {document.fileName}
                    </>
                  ) : (
                    "Belum diunggah"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {document.status === 'terverifikasi' ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Terverifikasi
                  </span>
                ) : document.status === 'menunggu' ? (
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
              {document.fileName && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(document)}
                  >
                    Lihat Dokumen
                  </Button>
                  {document.status !== 'terverifikasi' && isRegistrationPeriod && (
                    <>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(document.id, e)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Ganti Dokumen
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        Hapus
                      </Button>
                    </>
                  )}
                </>
              )}
              {!document.fileName && isRegistrationPeriod && (
                <>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(document.id, e)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Unggah Dokumen
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
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
  );
}