import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

function HeadmasterSettings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pengaturan</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="schoolName">Nama Sekolah</Label>
              <Input id="schoolName" defaultValue="Madrasah Aliyah Negeri" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" defaultValue="Jl. Pendidikan No. 123" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" defaultValue="021-1234567" />
            </div>
            <Button>Simpan Perubahan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Sistem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Email</Label>
                <p className="text-sm text-gray-500">
                  Aktifkan notifikasi email untuk laporan dan pembaruan
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Gelap</Label>
                <p className="text-sm text-gray-500">
                  Aktifkan tampilan mode gelap
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pembaruan Otomatis</Label>
                <p className="text-sm text-gray-500">
                  Aktifkan pembaruan sistem otomatis
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button>Ubah Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HeadmasterSettings; 