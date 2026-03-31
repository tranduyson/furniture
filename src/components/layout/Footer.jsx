import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">SONTD.</h3>
          <p className="text-gray-400 text-sm">Nội thất mang phong cách tối giản, hiện đại và chất lượng cao.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Danh mục</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/category/phong-khach" className="hover:text-white">Phòng khách</Link></li>
            <li><Link href="/category/phong-ngu" className="hover:text-white">Phòng ngủ</Link></li>
            <li><Link href="/category/phong-an" className="hover:text-white">Phòng ăn</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Chính sách</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/chuong-trinh-khuyen-mai" className="hover:text-white">Khuyến mãi</Link></li>
            <li><Link href="/chinh-sach-giao-hang" className="hover:text-white">Giao hàng</Link></li>
            <li><Link href="/chinh-sach-doi-tra" className="hover:text-white">Đổi trả</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Liên hệ</h4>
          <p className="text-sm text-gray-400 mb-2">Email: support@moho.vn</p>
          <p className="text-sm text-gray-400">Hotline: 1900 1234</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SONTD Furniture. All rights reserved.
      </div>
    </footer>
  );
}
