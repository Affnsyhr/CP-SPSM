import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Pendaftaran Berhasil!</h1>
          <p className="text-muted-foreground">
            Terima kasih telah mendaftar di Sistem Pendaftaran Siswa Madrasah. Silakan cek email Anda untuk verifikasi
            akun.
          </p>
        </div>
        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-lg">
          <img src="/placeholder.svg" alt="Sukses" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Kami telah mengirimkan email verifikasi ke alamat email yang Anda daftarkan. Silakan klik tautan di email
            tersebut untuk mengaktifkan akun Anda.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/login">
              <Button>Masuk ke Akun</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}