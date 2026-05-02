import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-black mb-4">SONDT<span className="text-red-600">.</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Nội thất cao cấp mang phong cách tối giản, hiện đại và chất lượng quốc tế cho gia đình bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20v-7.21H5.5V9.25h2.79V7.07c0-2.7 1.65-4.18 4.06-4.18 1.15 0 2.14.086 2.43.124v2.82h-1.67c-1.31 0-1.56.623-1.56 1.536V9.25h3.12l-.406 3.54h-2.714V20z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.515 10.009 10.009 0 01-2.8.856 4.926 4.926 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.822 4.822 0 00-8.835 4.398A13.652 13.652 0 011.671 3.149a4.822 4.822 0 001.493 6.43 4.784 4.784 0 01-2.191-.603v.06a4.823 4.823 0 003.864 4.743 4.822 4.822 0 01-2.191.084 4.824 4.824 0 004.504 3.35A9.646 9.646 0 010 19.54a13.645 13.645 0 007.403 2.17c8.882 0 13.72-7.357 13.72-13.72 0-.209-.005-.418-.015-.623a9.758 9.758 0 002.396-2.489z"/></svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/products?category=phong-khach" className="hover:text-white transition">Phòng Khách</Link></li>
              <li><Link href="/products?category=phong-ngu" className="hover:text-white transition">Phòng Ngủ</Link></li>
              <li><Link href="/products?category=phong-an" className="hover:text-white transition">Phòng Ăn</Link></li>
              <li><Link href="/products?category=phong-lam-viec" className="hover:text-white transition">Phòng Làm Việc</Link></li>
              <li><Link href="/products?category=phong-tam" className="hover:text-white transition">Phòng Tắm</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-lg mb-6">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/chinh-sach-giao-hang" className="hover:text-white transition">Chính Sách Giao Hàng</Link></li>
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-white transition">Chính Sách Đổi Trả</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-white transition">Chính Sách Bảo Hành</Link></li>
              <li><Link href="/chinh-sach-thanh-toan" className="hover:text-white transition">Phương Thức Thanh Toán</Link></li>
              <li><Link href="/dieu-khoan-su-dung" className="hover:text-white transition">Điều Khoản Sử Dụng</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-6">Công Ty</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">Về SONDT</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog & Tin Tức</Link></li>
              <li><Link href="/stores" className="hover:text-white transition">Cửa Hàng Của Chúng Tôi</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Cơ Hội Việc Làm</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Liên Hệ Chúng Tôi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liên Hệ Với Chúng Tôi</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div>
                <p className="text-gray-300 font-semibold mb-1">📞 Hotline</p>
                <p className="hover:text-white transition cursor-pointer">1900-1234</p>
              </div>
              <div>
                <p className="text-gray-300 font-semibold mb-1">📧 Email</p>
                <p className="hover:text-white transition cursor-pointer">support@sondt.vn</p>
              </div>
              <div>
                <p className="text-gray-300 font-semibold mb-1">📍 Địa Chỉ</p>
                <p>123 Phố Yên Phụ<br/>Quận Tây Hồ, Hà Nội</p>
              </div>
              <div>
                <p className="text-gray-300 font-semibold mb-2">Giờ Hoạt Động</p>
                <p>Thứ Hai - Chủ Nhật<br/>09:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} SONDT Furniture Co., Ltd. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition">Chính Sách Riêng Tư</Link>
            <Link href="/terms" className="hover:text-white transition">Điều Khoản Dịch Vụ</Link>
            <Link href="/sitemap" className="hover:text-white transition">Sơ Đồ Trang Web</Link>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-800 px-4 py-6 mt-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 text-sm mb-4">Phương Thức Thanh Toán Được Chấp Nhận</p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-white px-4 py-2 rounded">
              <span className="text-gray-900 font-bold text-sm">Visa</span>
            </div>
            <div className="bg-white px-4 py-2 rounded">
              <span className="text-gray-900 font-bold text-sm">Mastercard</span>
            </div>
            <div className="bg-white px-4 py-2 rounded">
              <span className="text-gray-900 font-bold text-sm">JCB</span>
            </div>
            <div className="bg-white px-4 py-2 rounded">
              <span className="text-gray-900 font-bold text-sm">PayPal</span>
            </div>
            <div className="bg-white px-4 py-2 rounded">
              <span className="text-gray-900 font-bold text-sm">Ngân Hàng</span>
            </div>
            <div className="bg-white px-4 py-2 rounded">
              <span className="text-gray-900 font-bold text-sm">Ví Điện Tử</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
