import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background" id="kontak">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Logo Madrasah"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-lg font-semibold">Madrasah</span>
          </div>
          <p className="text-sm text-muted-foreground">Sistem Pendaftaran Siswa Madrasah Online</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Navigasi</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="#tentang" className="hover:underline">
                  Tentang
                </Link>
              </li>
              <li>
                <Link to="#alur" className="hover:underline">
                  Alur Pendaftaran
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Bantuan</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Panduan
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Kontak</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@madrasah.sch.id" className="hover:underline">
                  info@madrasah.sch.id
                </a>
              </li>
              <li>
                <a href="tel:+6281234567890" className="hover:underline">
                  +62 812 3456 7890
                </a>
              </li>
              <li>
                <address className="not-italic">Jl. Madrasah No. 123, Jakarta</address>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 border-t py-6 md:flex-row md:items-center md:justify-between md:py-8">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Madrasah. Hak Cipta Dilindungi.</p>
        <div className="flex gap-4">
          <Link to="#" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            <span className="sr-only">Facebook</span>
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span className="sr-only">Instagram</span>
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}