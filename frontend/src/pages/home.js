import React from 'react';
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Pendaftaran Siswa Madrasah
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Sistem pendaftaran siswa madrasah online yang mudah, cepat, dan transparan. Daftar sekarang dan pantau
                    proses pendaftaran Anda.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/register">
                    <Button size="lg" className="px-8">
                      Daftar Sekarang
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="px-8">
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center w-full">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  loop
                  className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-lg"
                >
                  <SwiperSlide>
                    <img src="/Logo.png" alt="Logo 1" className="object-cover w-full h-full rounded-lg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="/Logo2.png" alt="Logo 2" className="object-cover w-full h-full rounded-lg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="/Logo3.png" alt="Logo 3" className="object-cover w-full h-full rounded-lg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="/logo512.png" alt="Logo 4" className="object-cover w-full h-full rounded-lg" />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="alur">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Alur Pendaftaran</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Proses pendaftaran siswa madrasah yang mudah dan transparan
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">1. Pendaftaran</h3>
                <p className="text-center text-muted-foreground">
                  Isi formulir pendaftaran dengan data diri dan unggah dokumen yang diperlukan
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">2. Verifikasi</h3>
                <p className="text-center text-muted-foreground">
                  Admin akan memverifikasi dokumen dan data yang telah diunggah
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">3. Notifikasi</h3>
                <p className="text-center text-muted-foreground">
                  Dapatkan notifikasi tentang status pendaftaran dan kelengkapan dokumen
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}