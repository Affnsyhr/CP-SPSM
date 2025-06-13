import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img
              src="/Logo.png"
              alt="Logo Madrasah"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="hidden font-bold sm:inline-block">
              Madrasah
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button>Daftar</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 