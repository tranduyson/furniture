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
    <div className="flex flex-col bg-white">
      {/* Hero Banner Carousel */}
      <section className="relative h-[500px] md:h-[650px] w-full overflow-hidden bg-gray-900">
        {banners.map((banner, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
              style={{ backgroundImage: `url('${banner.image}')` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            
            <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-white">
              <div className="max-w-2xl">
                <h2 className="text-blue-400 font-bold uppercase tracking-[0.3em] mb-4 text-sm md:text-base animate-fadeInUp">
                  SONTD Furniture
                </h2>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fadeInUp animate-delay-100">
                  {banner.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 0 ? 'text-white' : 'text-white'}> {word}</span>
                  ))}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg animate-fadeInUp animate-delay-200">
                  {banner.subtitle}
                </p>
                <div className="flex gap-4 animate-fadeInUp animate-delay-300">
                  <Link href="/products" className="bg-white text-gray-900 hover:bg-blue-600 hover:text-white font-bold py-4 px-10 rounded-full transition duration-300 shadow-xl">
                    Mua Ngay
                  </Link>
                  <Link href="/collections" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-10 rounded-full transition duration-300">
                    Bộ Sưu Tập
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {banners.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-10 bg-white' : 'w-4 bg-white bg-opacity-40'}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-500 text-lg">Khám phá những mẫu thiết kế được yêu thích nhất trong tháng này.</p>
          </div>
          <Link href="/products" className="inline-flex items-center text-blue-600 font-bold group">
            Xem tất cả sản phẩm <span className="ml-2 transform group-hover:translate-x-2 transition">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-2xl aspect-[4/5] mb-6"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products && products.length > 0 ? products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-100">
                  {product.primary_image ? (
                    <img 
                      src={product.primary_image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                    </div>
                  )}
                  
                  {product.discount_pct > 0 && (
                    <span className="absolute top-5 left-5 bg-red-600 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-lg z-10">
                      GIẢM {product.discount_pct}%
                    </span>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                       {product.category_name || 'SONTD Choice'}
                    </p>
                  </div>
                  <h3 className="text-xl text-gray-900 font-bold mb-3 line-clamp-1 group-hover:text-blue-600 transition duration-300">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price * (1 - product.discount_pct / 100))}
                    </span>
                    {product.discount_pct > 0 && (
                      <span className="text-sm text-gray-400 line-through font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
                <p className="text-gray-400 font-medium italic">Danh sách đang được cập nhật...</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* About Section Snippet */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
             <div className="aspect-square bg-gray-200 rounded-3xl overflow-hidden shadow-lg transform translate-y-8">
               <img src="/uploads/images/vice_item_4_thumb.png" className="w-full h-full object-cover" />
             </div>
             <div className="aspect-square bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
               <img src="/uploads/products/noi-that-moho-ghe-ban-ban-lam-viec-1_5ca3613622e047748b8fa872fb504296_large.jpg" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Câu chuyện của chúng tôi</h3>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Kiến tạo không gian,<br/>Gìn giữ hạnh phúc</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Tại SONTD, chúng tôi tin rằng mỗi món đồ nội thất không chỉ là vật dụng, mà là ngôn ngữ kể về phong cách sống và sự ấm áp của gia đình. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm bền vững nhất.
            </p>
            <Link href="/about" className="text-gray-900 font-black border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition">
              Tìm hiểu thêm về SONTD &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


