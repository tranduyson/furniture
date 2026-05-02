'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: '📊' },
  { href: '/admin/products', label: 'Sản phẩm', icon: '🪑' },
  { href: '/admin/orders', label: 'Đơn hàng', icon: '📦' },
  { href: '/admin/users', label: 'Người dùng', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check auth on first load
  useEffect(() => {
    const checkAuth = async () => {
      const saved = localStorage.getItem('user');
      if (!saved) { router.push('/login'); return; }
      const u = JSON.parse(saved);
      if (u.role !== 'admin') { router.push('/'); return; }
      setUser(u);
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-[99999] flex bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#1a1a2e] text-white flex flex-col transition-all duration-300 shrink-0 z-20`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight">SONTD</span>
              <span className="text-[10px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded">ADMIN</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-white/10 ml-auto">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${isActive
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {sidebarOpen && user && (
            <div className="mb-3">
              <p className="text-xs text-gray-400">Đăng nhập với</p>
              <p className="text-sm font-semibold truncate">{user.full_name}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Link href="/" className={`flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition ${sidebarOpen ? '' : 'justify-center'}`}>
              🏠 {sidebarOpen && 'Trang chủ'}
            </Link>
            <button onClick={handleLogout} className={`flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition ${sidebarOpen ? '' : 'justify-center'}`}>
              🚪 {sidebarOpen && 'Đăng xuất'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-bold text-gray-800">
            {navItems.find(i => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href)))?.label || 'Quản trị'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Xin chào, <strong>{user?.full_name}</strong></span>
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
              {user?.full_name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
