import React from "react";
import { Button } from "../../components/ui/button";

export default function SuperAdminSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">Konfigurasi sistem madrasah</p>
      </div>
      
      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Pengaturan Umum</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Sistem</label>
              <input
                type="text"
                className="w-full h-10 rounded-md border px-4"
                defaultValue="Sistem Pendaftaran Madrasah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Sistem</label>
              <input
                type="email"
                className="w-full h-10 rounded-md border px-4"
                defaultValue="admin@madrasah.id"
              />
            </div>
            <Button>Simpan Perubahan</Button>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Pengaturan Keamanan</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Durasi Sesi (menit)</label>
              <input
                type="number"
                className="w-full h-10 rounded-md border px-4"
                defaultValue="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maksimal Percobaan Login</label>
              <input
                type="number"
                className="w-full h-10 rounded-md border px-4"
                defaultValue="5"
              />
            </div>
            <Button>Simpan Perubahan</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 