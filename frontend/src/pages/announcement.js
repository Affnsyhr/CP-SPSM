import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

export default function AnnouncementPage() {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isAnnouncementTime, setIsAnnouncementTime] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [result, setResult] = useState(null);

  // Simulasi tanggal pengumuman (dalam implementasi nyata, ini akan datang dari API)
  const announcementDate = new Date('2024-05-15T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = announcementDate - now;

      if (difference <= 0) {
        setIsAnnouncementTime(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckResult = () => {
    // Simulasi pengecekan hasil (dalam implementasi nyata, ini akan datang dari API)
    const isAccepted = Math.random() > 0.5;
    setResult(isAccepted ? 'diterima' : 'ditolak');
    setHasChecked(true);

    toast({
      title: isAccepted ? "Selamat!" : "Mohon maaf",
      description: isAccepted 
        ? "Anda telah diterima di Madrasah kami" 
        : "Anda belum berhasil diterima di Madrasah kami",
      variant: isAccepted ? "default" : "destructive",
    });
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pengumuman Penerimaan</h1>
            <p className="text-muted-foreground">
              Lihat status penerimaan Anda di Madrasah
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

      <div className="grid gap-6">
        {/* Countdown Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Menunggu Pengumuman</h2>
          <p className="text-muted-foreground mb-6">
            Pengumuman akan tersedia pada tanggal 15 Mei 2024
          </p>
          <div className="grid grid-cols-4 gap-4 text-center mb-6">
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-sm text-muted-foreground">Hari</div>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm text-muted-foreground">Jam</div>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm text-muted-foreground">Menit</div>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-2xl font-bold">{timeLeft.seconds}</div>
              <div className="text-sm text-muted-foreground">Detik</div>
            </div>
          </div>

          {/* Tombol Lihat Hasil */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleCheckResult}
              disabled={!isAnnouncementTime}
              className={!isAnnouncementTime ? "opacity-50 cursor-not-allowed" : ""}
            >
              Lihat Hasil
            </Button>
            {!isAnnouncementTime && (
              <p className="text-sm text-muted-foreground mt-2">
                Hasil pengumuman belum tersedia
              </p>
            )}
          </div>
        </div>

        {/* Result Section */}
        {hasChecked && result && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="text-center">
              <div className={`mx-auto mb-4 rounded-full p-3 ${
                result === 'diterima' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={result === 'diterima' ? '#16a34a' : '#dc2626'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12"
                >
                  {result === 'diterima' ? (
                    <>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </>
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </>
                  )}
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {result === 'diterima' ? 'Selamat!' : 'Mohon Maaf'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {result === 'diterima'
                  ? 'Anda telah diterima di Madrasah kami'
                  : 'Anda belum berhasil diterima di Madrasah kami'}
              </p>
              {result === 'diterima' && (
                <Button size="lg">
                  Unduh Surat Penerimaan
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 