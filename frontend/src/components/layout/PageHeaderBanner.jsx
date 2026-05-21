'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ROUTE_CONFIGS = {
  '/products': { title: 'TẤT CẢ SẢN PHẨM', breadcrumb: 'Sản phẩm' },
  '/design': { title: 'THIẾT KẾ & THI CÔNG NỘI THẤT', breadcrumb: 'Thiết kế - Thi công' },
  '/promotions': { title: 'KHUYẾN MÃI ĐẶC BIỆT', breadcrumb: 'Khuyến mãi' },
  '/blog': { title: 'TIN TỨC & SỰ KIỆN', breadcrumb: 'Tin tức' },
  '/about': { title: 'GIỚI THIỆU VỀ SONDT', breadcrumb: 'Về SONDT' },
  '/stores': { title: 'HỆ THỐNG CỬA HÀNG', breadcrumb: 'Cửa hàng' },
  '/cart': { title: 'GIỎ HÀNG CỦA BẠN', breadcrumb: 'Giỏ hàng' },
  '/checkout': { title: 'TIẾN HÀNH THANH TOÁN', breadcrumb: 'Thanh toán' },
  '/orders': { title: 'QUẢN LÝ ĐƠN HÀNG', breadcrumb: 'Lịch sử mua hàng' },
  '/profile': { title: 'THÔNG TIN CÁ NHÂN', breadcrumb: 'Tài khoản' },
  '/login': { title: 'ĐĂNG NHẬP TÀI KHOẢN', breadcrumb: 'Đăng nhập' },
  '/register': { title: 'ĐĂNG KÝ THÀNH VIÊN', breadcrumb: 'Đăng ký' },
};

export default function PageHeaderBanner() {
  const pathname = usePathname();

  // Do not display banner on homepage, admin area, or checkout page if customized
  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  // Determine title and breadcrumb based on current path
  let config = ROUTE_CONFIGS[pathname];
  
  // If it's a detail page (like /products/some-slug)
  if (!config) {
    if (pathname.startsWith('/products/')) {
      config = { title: 'CHI TIẾT SẢN PHẨM', breadcrumb: 'Sản phẩm / Chi tiết' };
    } else if (pathname.startsWith('/blog/')) {
      config = { title: 'TIN CHI TIẾT', breadcrumb: 'Tin tức / Chi tiết' };
    } else {
      // Fallback
      config = { title: 'SONDT FURNITURE', breadcrumb: 'Trang' };
    }
  }

  return (
    <section 
      className="relative w-full h-[280px] md:h-[380px] flex items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80')" }}
    >
      {/* Premium Charcoal-Gold tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#2d2118]/75 to-[#1a1a1a]/95"></div>
      
      {/* Texture Details */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '30px 30px' }}
      />
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* Accent Line */}
          <div className="w-16 h-[3px] bg-[#d4a843] mb-6"></div>
          
          {/* Main Title using Lora serif font */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-widest mb-6 font-serif leading-tight">
            {config.title}
          </h1>
          
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-300 font-semibold uppercase tracking-wider">
            <Link href="/" className="hover:text-[#d4a843] transition">Trang chủ</Link>
            <span className="text-gray-500">/</span>
            <span className="text-[#d4a843]">{config.breadcrumb}</span>
          </nav>
        </div>
      </div>
    </section>
  );
}
