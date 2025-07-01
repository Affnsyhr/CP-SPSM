import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

const adminMenu = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Kelola Pendaftar', path: '/admin/manage-registrations' },
  { label: 'Siswa', path: '/admin/students' },
  { label: 'Dokumen', path: '/admin/documents' },
  { label: 'Orang Tua', path: '/admin/parent-accounts' },
  { label: 'Periode', path: '/admin/period' },
  { label: 'Kuota', path: '/admin/quota' },
];

const waliMenu = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Dokumen', path: '/dashboard/documents' },
  { label: 'Pengumuman', path: '/dashboard/announcement' },
];

const superAdminMenu = [
  { label: 'Dashboard', path: '/super-admin/dashboard' },
  { label: 'Kelola Admin', path: '/super-admin/admins' },
  { label: 'Log Aktivitas', path: '/super-admin/activity-logs' },
  { label: 'Manajemen Program', path: '/super-admin/program-management' },
];

export { adminMenu, waliMenu, superAdminMenu };

export function Sidebar({ menu = adminMenu }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden p-2">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Buka menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </Button>
      </div>
      {/* Sidebar drawer for mobile */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
          <div className="w-64 bg-white h-full shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Tutup menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </Button>
            </div>
            <nav className="flex flex-col gap-2">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded px-3 py-2 text-left text-sm font-medium hover:bg-primary/10 ${location.pathname === item.path ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed md:top-0 md:left-0 md:bg-white md:border-r md:py-8 md:px-4 md:space-y-4">
        <span className="font-bold text-lg mb-6">Menu</span>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded px-3 py-2 text-left text-sm font-medium hover:bg-primary/10 ${location.pathname === item.path ? 'bg-primary/10 text-primary' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Spacer for main content on desktop */}
      <div className="hidden md:block md:w-64" />
    </>
  );
} 