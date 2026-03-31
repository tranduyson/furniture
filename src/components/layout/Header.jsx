'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
          SONTD<span className="text-blue-600">.</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/products" className="text-gray-600 hover:text-gray-900 font-medium">Sản phẩm</Link>
          <Link href="/collections" className="text-gray-600 hover:text-gray-900 font-medium">Bộ sưu tập</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">Về chúng tôi</Link>
        </nav>
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Xin chào,</span>
                <span className="text-sm font-bold text-gray-900">{user.full_name.split(' ').pop()}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-medium transition"
              >
                Thoát
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

