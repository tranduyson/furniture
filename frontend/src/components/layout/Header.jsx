'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`${apiUrl}/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`)
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data && res.data.products) {
            setSearchResults(res.data.products);
          }
        })
        .finally(() => setIsSearching(false));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, apiUrl]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage');
      }
    }
    
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      setCartCount(cart.length || 0);
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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      {/* Promotional Top Banner Image */}
      <div 
        className="h-10 w-full relative flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=40')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        <div className="relative z-10 flex items-center gap-4 text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.15em] text-center px-4">
          <span className="flex items-center justify-center gap-1">
            <span className="animate-pulse inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
            🔥 ƯU ĐÃI LỚN NHẤT NĂM: GIẢM GIÁ ĐẾN 30% CHO TẤT CẢ SẢN PHẨM
          </span>
          <span className="mx-2 text-white/30 max-md:hidden">|</span>
          <span className="max-md:hidden">MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN HÀNG TỪ 5TRđ</span>
        </div>
      </div>

      {/* Top bar with contact info */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs text-gray-600">
          <div className="flex space-x-6">
            <span>📞 Hotline: 0326330991</span>
            <span>📧 sondt@sondt.vn</span>
          </div>
          <div className="flex space-x-4">
            <span>Giao hàng toàn quốc</span>
            <span>Đổi trả 30 ngày</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-3xl font-bold text-gray-900">
              SONDT<span className="text-red-600">.</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-grow max-w-xl relative group" onMouseLeave={() => setShowSearchDropdown(false)}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => { if(searchQuery) setShowSearchDropdown(true); }}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto py-2">
                    {searchResults.map(p => (
                      <Link 
                        href={`/products/${p.slug}`} 
                        key={p.id}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 mr-3 overflow-hidden">
                          {p.primary_image ? (
                            <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-red-600">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.base_price * (1 - p.discount_pct / 100))}
                            </span>
                            {p.discount_pct > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.base_price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link href={`/products?search=${searchQuery}`} onClick={() => setShowSearchDropdown(false)} className="block w-full text-center py-3 bg-gray-50 text-blue-600 font-semibold text-sm hover:bg-gray-100">
                      Xem tất cả kết quả
                    </Link>
                  </div>
                ) : !isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Không tìm thấy sản phẩm nào phù hợp với "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-6">
            {/* Account */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-red-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user ? (
                  <div className="flex flex-col items-start ml-2 leading-tight">
                    <span className="text-[11px] text-gray-500 font-normal">Tài khoản của</span>
                    <span className="text-sm font-medium flex items-center">
                      {user.full_name || user.name || 'Người dùng'}
                      <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium ml-2">Tài khoản</span>
                )}
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role === 'admin' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 inline-block">Admin</span>}
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 font-semibold">
                        🔧 Quản trị Admin
                      </Link>
                    )}
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">
                      Đơn hàng của tôi
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">
                      Hồ sơ cá nhân
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 border-b border-gray-100">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-sm font-medium ml-1">Giỏ hàng</span>
            </Link>

            {/* Chat */}
            <button className="flex items-center text-gray-700 hover:text-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="mt-4 flex space-x-8 border-t border-gray-100 pt-4">
          <Link href="/products" className="text-gray-700 hover:text-red-600 font-medium text-sm transition">
            Sản phẩm
          </Link>
          <Link href="/design" className="text-gray-700 hover:text-red-600 font-medium text-sm transition">
            Thiết kế - Thi công
          </Link>
          <Link href="/promotions" className="text-gray-700 hover:text-red-600 font-medium text-sm transition">
            Khuyến mãi
          </Link>
          <Link href="/blog" className="text-gray-700 hover:text-red-600 font-medium text-sm transition">
            Tin tức
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium text-sm transition">
            Về SONDT
          </Link>
          <Link href="/stores" className="text-gray-700 hover:text-red-600 font-medium text-sm transition">
            Cửa hàng
          </Link>
        </nav>
      </div>
    </header>
  );
}

