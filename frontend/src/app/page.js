'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const banners = [
    {
      image: '/uploads/banner/background_banner_1.jpg',
      title: 'Nội Thất Hiện Đại 2024',
      subtitle: 'Nâng tầm không gian sống với phong cách Minimalist tinh tế.'
    },
    {
      image: '/uploads/banner/background_banner_2.jpg',
      title: 'Ưu Đãi Đặc Biệt',
      subtitle: 'Giảm giá lên đến 20% cho tất cả các bộ sưu tập phòng ngủ.'
    },
    {
      image: '/uploads/banner/background_banner_3.jpg',
      title: 'Chất Lượng Xuất Khẩu',
      subtitle: 'Sản phẩm đạt chuẩn Châu Âu, an toàn cho cả gia đình.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products?limit=8&is_featured=1`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, [apiUrl]);

  return (
    <div className="flex flex-col bg-white font-sans">
      {/* Hero Banner - Modern Full Screen */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-900">
        {banners.map((banner, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div 
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ${index === currentBanner ? 'scale-110' : 'scale-100'}`}
              style={{ backgroundImage: `url('${banner.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            </div>
            
            <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center items-start text-white">
              <div className="max-w-3xl">
                <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md bg-white/10 mb-6 animate-fadeInUp">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">Bộ Sưu Tập Mới 2024</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] animate-fadeInUp animate-delay-100">
                  {banner.title.split(' ').map((word, i) => (
                     <span key={i} className="block">{word}</span>
                  ))}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-xl font-light leading-relaxed animate-fadeInUp animate-delay-200">
                  {banner.subtitle}
                </p>
                <div className="flex flex-wrap gap-5 animate-fadeInUp animate-delay-300">
                  <Link href="/products" className="bg-red-600 text-white hover:bg-red-700 font-bold py-4 px-10 rounded-full transition duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                    Khám Phá Ngay
                  </Link>
                  <Link href="/collections" className="bg-transparent border border-white/50 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-10 rounded-full transition duration-300">
                    Xem Câu Chuyện
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-12 left-6 md:left-12 z-20 flex space-x-3">
          {banners.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === currentBanner ? 'w-12 bg-red-600' : 'w-4 bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges / Features */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {[
              { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Cho đơn hàng từ 5 triệu' },
              { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Lỗi từ nhà sản xuất' },
              { icon: '🛡️', title: 'Bảo hành 5 năm', desc: 'Yên tâm sử dụng' },
              { icon: '🎧', title: 'Hỗ trợ 24/7', desc: 'Luôn bên bạn' }
            ].map((f, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-4 ${i === 0 ? '' : 'pl-4'}`}>
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Grid Layout */}
      <section className="w-full container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Không Gian Sống</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Chọn nội thất theo từng không gian để kiến tạo ngôi nhà mơ ước của bạn.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          {/* Main Large Category */}
          <Link href="/products?category=phong-khach" className="md:col-span-8 group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500">
            <img src="/uploads/banner/background_banner_1.jpg" alt="Phòng khách" className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
              <div className="p-10 w-full transform translate-y-4 group-hover:translate-y-0 transition duration-500">
                <span className="bg-white text-gray-900 text-xs font-bold uppercase px-3 py-1 rounded-full mb-3 inline-block">Nổi bật</span>
                <h3 className="text-white text-4xl md:text-5xl font-black mb-2">Phòng Khách</h3>
                <p className="text-white/80 text-lg mb-4 opacity-0 group-hover:opacity-100 transition duration-500 delay-100">Ghế, bàn, tủ & hơn thế nữa</p>
                <span className="inline-flex items-center text-white font-bold group-hover:text-red-400 transition">
                  Khám phá <span className="ml-2">&rarr;</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Side Categories */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link href="/products?category=phong-ngu" className="flex-1 group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500">
              <img src="/uploads/banner/background_banner_2.jpg" alt="Phòng ngủ" className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                <div className="p-8 w-full">
                  <h3 className="text-white text-3xl font-bold mb-1">Phòng Ngủ</h3>
                  <span className="text-white/80 text-sm group-hover:text-white transition">Xem bộ sưu tập &rarr;</span>
                </div>
              </div>
            </Link>

            <Link href="/products?category=phong-an" className="flex-1 group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500">
              <img src="/uploads/banner/background_banner_3.jpg" alt="Phòng ăn" className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                <div className="p-8 w-full">
                  <h3 className="text-white text-3xl font-bold mb-1">Phòng Ăn</h3>
                  <span className="text-white/80 text-sm group-hover:text-white transition">Xem bộ sưu tập &rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Collection Showcase */}
      <section className="w-full bg-gray-900 py-32 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-red-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img 
                  src="/uploads/banner/background_banner_1.jpg"
                  alt="Luxury Pro Collection"
                  className="w-full h-[600px] object-cover scale-105 hover:scale-100 transition duration-1000"
                />
              </div>
              {/* Floating Element */}
              <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-xs shadow-2xl">
                <p className="text-white text-sm font-semibold uppercase mb-2">🎁 Ưu đãi độc quyền</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">Nhận ngay gói tư vấn thiết kế 3D trị giá 5.000.000đ khi đặt mua trọn bộ.</p>
                <div className="text-2xl font-black text-white">Chỉ từ 12.5Tr</div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 flex flex-col justify-center text-white">
              <span className="text-red-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">Signature Collection</span>
              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Luxury <br/>Pro <span className="text-gray-500 font-light">Series</span>
              </h2>
              <p className="text-gray-400 text-xl mb-10 leading-relaxed font-light">
                Biến không gian sống thành một kiệt tác nghệ thuật. Từng đường nét thiết kế, chất liệu đều được tuyển chọn khắt khe để mang lại sự sang trọng vượt thời gian.
              </p>
              
              <div className="flex gap-4 flex-wrap">
                <Link href="/products?collection=luxury-pro" className="bg-white text-gray-900 hover:bg-red-600 hover:text-white font-bold py-4 px-10 rounded-full transition duration-300 shadow-xl">
                  Mua Trọn Bộ Ngay
                </Link>
                <Link href="/collections" className="bg-transparent border border-white/30 hover:border-white text-white font-bold py-4 px-10 rounded-full transition duration-300">
                  Xem Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-gray-200 pb-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Xu Hướng Mới</h2>
            <p className="text-gray-500 text-lg">Những sản phẩm nội thất được khách hàng săn đón nhất tuần qua.</p>
          </div>
          <Link href="/products" className="inline-flex items-center text-gray-900 font-bold hover:text-red-600 group uppercase tracking-widest text-sm">
            Xem tất cả <span className="ml-2 transform group-hover:translate-x-2 transition">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products && products.length > 0 ? products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                  {product.primary_image ? (
                    <img 
                      src={product.primary_image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                    </div>
                  )}
                  
                  {product.discount_pct > 0 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md z-10 uppercase">
                      -{product.discount_pct}%
                    </span>
                  )}

                  {/* Add to Cart Overlay Button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="w-full bg-gray-900/90 backdrop-blur-sm text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition shadow-lg">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                     {product.category_name || 'Nội thất'}
                  </p>
                  <h3 className="text-lg text-gray-900 font-bold mb-3 line-clamp-2 group-hover:text-red-600 transition duration-300 flex-grow">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                    <span className="text-xl font-black text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price * (1 - product.discount_pct / 100))}
                    </span>
                    {product.discount_pct > 0 && (
                      <span className="text-xs text-gray-400 line-through font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium italic">Không có sản phẩm nào.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* About / Story Section */}
      <section className="bg-gray-50 py-32 border-t border-gray-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-6 relative">
             <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl transform translate-y-12 z-10">
               <img src="/uploads/images/vice_item_4_thumb.png" alt="Interior" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
             </div>
             <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-xl">
               <img src="/uploads/products/noi-that-moho-ghe-ban-ban-lam-viec-1_5ca3613622e047748b8fa872fb504296_large.jpg" alt="Interior Details" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
             </div>
             <div className="absolute -inset-4 border border-gray-300 rounded-[2.5rem] -z-10 transform -rotate-3"></div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-gray-500 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Chất Lượng Vượt Thời Gian</span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">Biến ngôi nhà thành <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">tổ ấm đích thực</span></h2>
            <p className="text-gray-600 text-xl mb-10 leading-relaxed font-light">
              Tại SONTD, chúng tôi không chỉ bán nội thất, chúng tôi trao gửi những giá trị tinh thần. Mỗi chiếc ghế, mỗi chiếc bàn đều được chế tác bằng tâm huyết, mang theo câu chuyện về sự đoàn tụ và yêu thương.
            </p>
            <Link href="/about" className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-red-600 font-bold py-4 px-10 rounded-full transition duration-300 shadow-xl">
              Đọc Câu Chuyện SONTD <span className="text-xl">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


