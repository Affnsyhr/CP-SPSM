import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md space-y-8 text-center bg-white p-8 rounded-lg shadow">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Registrasi Berhasil!</h1>
        <p className="text-muted-foreground mb-6">
          Akun Anda berhasil dibuat. Silakan klik tombol di bawah untuk masuk ke akun Anda.
        </p>
        <Link to="/login">
          <Button size="lg" className="w-full">Masuk ke Halaman Login</Button>
        </Link>
      </div>
    </div>
  );
}