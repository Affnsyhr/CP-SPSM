import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { Sidebar, waliMenu } from "../../components/layout/sidebar";

export default function AnnouncementPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pengumuman, setPengumuman] = useState([]);

  // Fetch data pengumuman dari backend
  const fetchPengumuman = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orangtua/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const pendaftaran = Array.isArray(data.data.pendaftaran) ? data.data.pendaftaran : [];
        setPengumuman(pendaftaran);
      } else {
        setPengumuman([]);
      }
    } catch (err) {
      setPengumuman([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

  // Helper untuk status
  const getStatusLabel = (status) => {
    if (status === 'lulus') return { label: 'Diterima', color: 'bg-green-100 text-green-800' };
    if (status === 'tidak_lulus') return { label: 'Ditolak', color: 'bg-red-100 text-red-800' };
    return { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' };
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar menu={waliMenu} />
      <div className="flex-1 flex flex-col">
        <div className="container py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Pengumuman Penerimaan</h1>
                <p className="text-muted-foreground">
                  Status penerimaan siswa Anda di Madrasah
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <span className="ml-4">Memuat data pengumuman...</span>
              </div>
            ) : pengumuman.length === 0 ? (
              <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
                <p className="text-muted-foreground">Belum ada data pendaftaran siswa.</p>
              </div>
            ) : (
              pengumuman.map((item, idx) => {
                const status = getStatusLabel(item.status_pendaftaran);
                return (
                  <div key={item.pendaftaran_id || idx} className="rounded-lg border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="font-semibold text-lg">{item.nama_lengkap}</div>
                      <div className="text-sm text-muted-foreground">Program: {item.nama_program} | Tahun Ajaran: {item.tahun_ajaran}</div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-semibold text-center ${status.color}`}>{status.label}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 