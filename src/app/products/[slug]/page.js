"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductDetail({ params }) {
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (e) {
        console.error("Lỗi lấy chi tiết sản phẩm:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, apiUrl]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 aspect-square rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-gray-100 rounded w-3/4"></div>
            <div className="h-6 bg-gray-100 rounded w-1/2"></div>
            <div className="h-24 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/products" className="hover:text-blue-600 transition">Sản phẩm</Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Left: Product Images */}
        <div className="space-y-6">
          <div className="w-full aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {product.primary_image ? (
              <img 
                src={product.primary_image} 
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
               <div className="aspect-square bg-blue-50 border-2 border-blue-600 rounded-xl overflow-hidden">
                  <img src={product.primary_image} className="w-full h-full object-cover" />
               </div>
               {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 cursor-pointer transition flex items-center justify-center opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">{product.category_name}</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-4 mb-8">
             <div className="flex text-yellow-400">★★★★★</div>
             <span className="text-sm text-gray-400 font-medium">Bản quyền SONTD Furniture | SKU: {product.sku_base}</span>
          </div>
          
          <div className="mb-8 flex items-baseline gap-4">
            <span className="text-4xl font-black text-gray-900">
               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price * (1 - product.discount_pct / 100))}
            </span>
            {product.discount_pct > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                </span>
                <span className="bg-red-600 text-white px-3 py-1 text-xs font-black rounded-lg shadow-md shadow-red-100">
                  TIẾT KIỆM {product.discount_pct}%
                </span>
              </>
            )}
          </div>

          <div className="text-gray-600 mb-10 text-lg leading-relaxed border-l-4 border-blue-600 pl-6 py-2 bg-blue-50 rounded-r-xl">
             {product.short_desc || 'Sản phẩm nội thất cao cấp mang thương hiệu SONTD, được chế tác từ những vật liệu bền bỉ và thân thiện nhất.'}
          </div>

          {/* Add to Cart Section */}
          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl h-14 w-40 bg-white overflow-hidden shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-2xl text-gray-400 transition">-</button>
                <input type="number" readOnly value={quantity} className="flex-1 text-center font-bold text-gray-900 focus:outline-none" />
                <button onClick={() => setQuantity(quantity+1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-2xl text-gray-400 transition">+</button>
              </div>
              <button className="flex-1 bg-gray-900 hover:bg-blue-600 text-white h-14 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl shadow-gray-200 uppercase tracking-widest">
                Thêm Vào Giỏ
              </button>
            </div>
            
            <button className="w-full bg-blue-50 border-2 border-blue-100 text-blue-700 h-14 rounded-2xl font-black transition hover:bg-blue-100">
              MUA NGAY - GIAO NHANH 24H
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">BẢO HÀNH</p>
              <p className="text-xs text-gray-900 font-bold">{product.warranty_months} tháng</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">VẬN CHUYỂN</p>
              <p className="text-xs text-gray-900 font-bold">{product.free_shipping ? 'Miễn phí' : 'Tính phí'}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">LẮP ĐẶT</p>
              <p className="text-xs text-gray-900 font-bold">{product.free_install ? 'Miễn phí' : 'Tính phí'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-b mb-10 border-gray-100 flex gap-12 overflow-x-auto scroller-hide">
        <button onClick={() => setActiveTab('desc')} className={`pb-4 font-bold text-xl transition-all whitespace-nowrap ${activeTab === 'desc' ? 'border-b-4 border-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Chi Tiết Sản Phẩm</button>
        <button onClick={() => setActiveTab('specs')} className={`pb-4 font-bold text-xl transition-all whitespace-nowrap ${activeTab === 'specs' ? 'border-b-4 border-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Thông Số</button>
        <button onClick={() => setActiveTab('reviews')} className={`pb-4 font-bold text-xl transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-4 border-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Đánh Giá Khách Hàng</button>
      </div>

      <div className="min-h-[300px] mb-24">
        {activeTab === 'desc' && (
          <div className="prose max-w-none text-gray-600 text-lg leading-loose">
            <p className="mb-6">{product.meta_description || product.short_desc}</p>
            <p>Sản phẩm này là minh chứng cho tinh thần cống hiến của SONTD trong việc tạo ra những tác phẩm nghệ thuật nội thất có thể sử dụng hàng ngày. Với các đường nét mượt mà và vật liệu cao cấp, nó vừa đóng vai trò là một vật dụng thiết thực vừa là một điểm nhấn trang trí tinh mĩ cho trung tâm ngôi nhà bạn.</p>
          </div>
        )}
        {activeTab === 'specs' && (
          <div className="max-w-2xl border border-gray-100 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <tbody>
                <tr className="bg-gray-50 border-b border-gray-100"><th className="p-6 text-gray-500 font-bold uppercase text-xs w-48">Mã Sản Phẩm</th><td className="p-6 text-gray-900 font-bold">{product.sku_base}</td></tr>
                <tr className="border-b border-gray-100"><th className="p-6 text-gray-500 font-bold uppercase text-xs w-48">Danh Mục</th><td className="p-6 text-gray-900 font-bold">{product.category_name}</td></tr>
                <tr className="bg-gray-50 border-b border-gray-100"><th className="p-6 text-gray-500 font-bold uppercase text-xs w-48">Bảo Hành</th><td className="p-6 text-gray-900 font-bold">{product.warranty_months} tháng</td></tr>
                <tr className="border-b border-gray-100"><th className="p-6 text-gray-500 font-bold uppercase text-xs w-48">Vận Chuyển</th><td className="p-6 text-gray-900 font-bold">{product.free_shipping ? 'Miễn phí toàn quốc' : 'Theo phí đơn hàng'}</td></tr>
                <tr className="bg-gray-50"><th className="p-6 text-gray-500 font-bold uppercase text-xs w-48">Lắp Đặt</th><td className="p-6 text-gray-900 font-bold">{product.free_install ? 'Miễn phí tại nhà' : 'Có phí'}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="bg-gray-50 rounded-3xl p-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
             <span className="text-gray-400 italic">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!</span>
          </div>
        )}
      </div>
    </div>
  );
}

