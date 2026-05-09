'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products?limit=8&is_featured=1`);
        const data = await res.json();
        if (data.success) setProducts(data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchFeaturedProducts();
  }, [apiUrl]);

  const categories = [
    { name: 'Phòng Khách', desc: 'Sofa, bàn trà, kệ tivi', href: '/products?category=phong-khach',
      icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M3 17h18M5 17V9a2 2 0 012-2h10a2 2 0 012 2v8M3 17l1-3h16l1 3M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"/></svg> },
    { name: 'Phòng Ngủ', desc: 'Giường, tủ, bàn trang điểm', href: '/products?category=phong-ngu',
      icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M3 19V5M21 19V5M3 12h18M3 16h18M7 12V8a1 1 0 011-1h3a1 1 0 011 1v4M13 12V8a1 1 0 011-1h3a1 1 0 011 1v4"/></svg> },
    { name: 'Phòng Ăn', desc: 'Bàn ăn, ghế, tủ bếp', href: '/products?category=phong-an',
      icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M12 3v18M3 12h18M5 3v6a7 7 0 007 7M19 3v6a7 7 0 01-7 7"/></svg> },
    { name: 'Văn Phòng', desc: 'Bàn, ghế công thái học', href: '/products?category=van-phong',
      icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path d="M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4M12 17v4M8 21h8"/></svg> },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden" style={{background:'linear-gradient(135deg, #1a1a1a 0%, #2d2118 40%, #1a1a1a 100%)'}}>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber-700/10 blur-[100px]"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-900/8 blur-[120px]"></div>
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="gold-line"></div>
                <span className="text-amber-400/80 text-xs font-semibold uppercase tracking-[0.25em]">Since 2020</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-[1.1] font-extrabold">
                Kiến Tạo<br/>
                <span style={{color:'#d4a843'}}>Không Gian</span><br/>
                Đẳng Cấp
              </h1>
              <p className="text-gray-400 text-base md:text-lg max-w-md mb-10 leading-relaxed">
                Nội thất cao cấp được chế tác tỉ mỉ, kết hợp giữa nghệ thuật truyền thống và thiết kế đương đại.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="group relative overflow-hidden text-white font-semibold py-3.5 px-8 rounded-none text-sm uppercase tracking-widest transition-all duration-500" style={{background:'linear-gradient(135deg, #b8860b, #d4a843)'}}>
                  <span className="relative z-10">Khám phá bộ sưu tập</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
                <Link href="/products" className="border border-white/25 text-white/80 hover:text-white hover:border-white/60 font-semibold py-3.5 px-8 rounded-none text-sm uppercase tracking-widest transition-all duration-300">
                  Xem sản phẩm
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="w-80 h-80 border border-amber-700/20 rounded-full flex items-center justify-center">
                <div className="w-60 h-60 border border-amber-700/15 rounded-full flex items-center justify-center animate-float">
                  <div className="w-40 h-40 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg, rgba(184,134,11,0.15), rgba(212,168,67,0.08))'}}>
                    <span className="text-5xl font-extrabold" style={{color:'#d4a843'}}>S</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-8 right-8 bg-white/5 backdrop-blur border border-white/10 px-5 py-3 rounded-sm">
                <p className="text-amber-400/70 text-[10px] uppercase tracking-widest mb-1">Chất liệu</p>
                <p className="text-white text-sm font-semibold">Gỗ tự nhiên</p>
              </div>
              <div className="absolute bottom-12 left-4 bg-white/5 backdrop-blur border border-white/10 px-5 py-3 rounded-sm">
                <p className="text-amber-400/70 text-[10px] uppercase tracking-widest mb-1">Bảo hành</p>
                <p className="text-white text-sm font-semibold">Lên đến 5 năm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[#1a1a1a] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              {num:'5,000+', label:'Sản phẩm'},
              {num:'12,000+', label:'Khách hàng'},
              {num:'50+', label:'Thương hiệu'},
              {num:'99%', label:'Hài lòng'},
            ].map((s,i)=>(
              <div key={i} className="py-8 md:py-10 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.num}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-12 md:py-14" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              {icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.131-.506 1.125-1.125l-.001-.661a2.25 2.25 0 00-.659-1.591l-2.024-2.024a2.25 2.25 0 00-1.591-.659H14.25M3.75 9.75h9.75M3.75 6.75h7.5"/></svg>, t:'Giao hàng miễn phí', d:'Đơn từ 5.000.000đ'},
              {icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>, t:'Đổi trả 30 ngày', d:'Miễn phí đổi trả'},
              {icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>, t:'Bảo hành 5 năm', d:'Cam kết chất lượng'},
              {icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>, t:'Tư vấn 24/7', d:'Hỗ trợ chuyên nghiệp'},
            ].map((s,i)=>(
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 text-[#b8860b]">{s.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{s.t}</h4>
                  <p className="text-xs text-gray-500">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"></div>
              <span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Danh mục</span>
              <div className="w-8 h-[1px] bg-[#b8860b]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Không Gian Sống</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Khám phá nội thất theo từng không gian, kiến tạo ngôi nhà mơ ước.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {categories.map((cat,i)=>(
              <Link href={cat.href} key={i} className="group text-center p-8 md:p-10 border border-gray-100 hover:border-[#d4a843]/40 rounded-sm transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-white hover:bg-[#fdfbf7]">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#f9f6f2] group-hover:bg-[#b8860b]/10 text-[#b8860b] mb-5 md:mb-6 transition-all duration-500 group-hover:scale-110">
                  {cat.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b8860b] transition">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{cat.desc}</p>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#b8860b] opacity-0 group-hover:opacity-100 transition-all duration-500">Xem thêm →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 md:py-28" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#b8860b]"></div>
                <span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Nổi bật</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">Sản Phẩm Bán Chạy</h2>
              <p className="text-gray-500 text-base">Được khách hàng yêu thích và đánh giá cao nhất.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-[#b8860b] font-semibold text-sm uppercase tracking-widest hover:gap-3 transition-all border-b border-[#b8860b]/30 pb-1">
              Xem tất cả <span>&rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1,2,3,4].map(i=>(
                <div key={i} className="animate-pulse bg-white rounded-sm">
                  <div className="bg-gray-200 aspect-square"></div>
                  <div className="p-5"><div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div><div className="h-5 bg-gray-200 rounded w-full mb-3"></div><div className="h-5 bg-gray-200 rounded w-1/2"></div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {products && products.length > 0 ? products.map(product=>(
                <Link href={`/products/${product.slug}`} key={product.id} className="group bg-white rounded-sm overflow-hidden border border-gray-100 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 flex flex-col">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.primary_image ? (
                      <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                    )}
                    {product.discount_pct > 0 && (
                      <span className="absolute top-3 left-3 bg-[#b8860b] text-white text-[10px] font-bold px-2.5 py-1 z-10 uppercase tracking-wider">-{product.discount_pct}%</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                      <button className="w-full bg-[#1a1a1a]/90 backdrop-blur text-white py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#b8860b] transition">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[10px] font-semibold text-[#b8860b] uppercase tracking-widest mb-2">{product.category_name || 'Nội thất'}</p>
                    <h3 className="text-base text-gray-900 font-semibold mb-3 line-clamp-2 group-hover:text-[#b8860b] transition flex-grow leading-snug">{product.name}</h3>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                      <span className="text-lg font-bold text-gray-900">{new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(product.base_price*(1-product.discount_pct/100))}</span>
                      {product.discount_pct > 0 && (
                        <span className="text-xs text-gray-400 line-through">{new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(product.base_price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center"><p className="text-gray-400 italic">Không có sản phẩm nào.</p></div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{background:'linear-gradient(135deg, #1a1a1a 0%, #2d2118 50%, #1a1a1a 100%)'}}>
        <div className="absolute inset-0 animate-shimmer"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#d4a843]"></div>
            <span className="text-[#d4a843] text-xs font-semibold uppercase tracking-[0.25em]">Ưu đãi</span>
            <div className="w-8 h-[1px] bg-[#d4a843]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight max-w-2xl mx-auto">
            Tư Vấn Thiết Kế <span style={{color:'#d4a843'}}>Miễn Phí</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Đội ngũ kiến trúc sư của SONDT sẵn sàng giúp bạn thiết kế không gian sống hoàn hảo.
          </p>
          <Link href="/products" className="inline-block text-white font-semibold py-3.5 px-10 text-sm uppercase tracking-widest transition-all duration-500 hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]" style={{background:'linear-gradient(135deg, #b8860b, #d4a843)'}}>
            Liên hệ ngay
          </Link>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"></div>
              <span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Về chúng tôi</span>
              <div className="w-8 h-[1px] bg-[#b8860b]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Nơi Nghệ Thuật Gặp <span style={{color:'#b8860b'}}>Cuộc Sống</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
              SONDT không chỉ bán nội thất — chúng tôi kiến tạo những không gian sống đầy cảm hứng. Mỗi sản phẩm là một tác phẩm nghệ thuật, được chế tác tỉ mỉ từ những chất liệu tốt nhất.
            </p>
            <Link href="/products" className="inline-flex items-center gap-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold py-3.5 px-8 text-sm uppercase tracking-widest transition-all duration-300">
              Khám phá thêm <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
