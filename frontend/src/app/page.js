'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);
const stars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));

// Reusable Product Card (MOHO style)
function ProductCard({ product, badge }) {
  const salePrice = product.base_price * (1 - (product.discount_pct || 0) / 100);
  return (
    <Link href={`/products/${product.slug}`} className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {product.discount_pct > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">-{product.discount_pct}%</span>
        )}
        {badge && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">{badge}</span>}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            Thêm vào giỏ
          </button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-800 font-semibold mb-2 line-clamp-2 group-hover:text-orange-600 transition flex-grow leading-snug min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-orange-600 font-bold text-base">{fmt(salePrice)}₫</span>
          {product.discount_pct > 0 && (
            <span className="text-xs text-gray-400 line-through">{fmt(product.base_price)}₫</span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="text-orange-400 text-xs">★★★★★</span>
          <span>Đã bán {product.total_sold || Math.floor(Math.random() * 200 + 10)}</span>
        </div>
      </div>
    </Link>
  );
}

// Section Header (MOHO style)
function SectionHeader({ title, href, color = '#e74c3c' }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl md:text-2xl font-extrabold relative pl-4" style={{ color }}>
        <span className="absolute left-0 top-0 bottom-0 w-1 rounded" style={{ background: color }}></span>
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color }}>
          Xem thêm <span>→</span>
        </Link>
      )}
    </div>
  );
}

// Slides data matching the premium design layouts in the screenshots
// Slides data using clean high-quality Unsplash backgrounds to avoid clashing text
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80',
    logo: 'SONTD',
    slogan: 'NỘI THẤT CHO CUỘC SỐNG HOÀN HẢO',
    title: (
      <>
        NỘI THẤT <span className="text-[#8B5E3C]">HIỆN ĐẠI</span><br />
        KHÔNG GIAN <span className="text-[#8B5E3C]">ĐẲNG CẤP</span>
      </>
    ),
    description: 'SONTD mang đến những sản phẩm nội thất tinh tế, chất lượng vượt trội, kiến tạo không gian sống hiện đại, sang trọng và tiện nghi.',
    cta: 'MUA SẮM NGAY',
    link: '/products',
    website: 'WWW.SONTD.VN',
    commitments: [
      { text: 'CAM KẾT CHẤT LƯỢNG', desc: 'Sản phẩm chính hãng, bền đẹp' },
      { text: 'GIAO HÀNG TOÀN QUỐC', desc: 'Nhanh chóng, an toàn' },
      { text: 'TƯ VẤN TẬN TÂM', desc: 'Hỗ trợ khách hàng 24/7' }
    ],
    footerSlogan: 'Nâng tầm không gian sống của bạn'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80',
    logo: 'SONTD',
    slogan: 'NỘI THẤT CHO CUỘC SỐNG HOÀN HẢO',
    title: (
      <>
        NÂNG TẦM<br />
        <span className="italic font-serif text-[#C49A6C] font-normal">Không gian sống</span><br />
        VỚI NỘI THẤT CAO CẤP
      </>
    ),
    description: 'SONTD mang đến giải pháp nội thất toàn diện với thiết kế tinh tế, chất lượng vượt trội, kiến tạo không gian sống hiện đại, sang trọng và tiện nghi.',
    promo: {
      title: 'ƯU ĐÃI ĐẶC BIỆT',
      value: 'UP TO 30%',
      desc: 'CHO ĐƠN HÀNG ĐẦU TIÊN'
    },
    cta: 'MUA SẮM DỄ DÀNG TẠI SONTD.VN',
    link: '/products',
    whyChooseUs: [
      { title: 'SẢN PHẨM CHẤT LƯỢNG', desc: 'Cam kết chất lượng cao, độ bền vượt trội.' },
      { title: 'GIAO HÀNG TOÀN QUỐC', desc: 'Giao hàng nhanh chóng, đóng gói cẩn thận.' },
      { title: 'TƯ VẤN TẬN TÂM', desc: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7.' },
      { title: 'BẢO HÀNH UY TÍN', desc: 'Chính sách bảo hành dài hạn, an tâm khi sử dụng.' }
    ],
    contactInfo: {
      website: 'WWW.SONTD.VN',
      hotline: '1900 1234',
      showroom: '123 Đường Nội Thất, P. An Phú, TP. Thủ Đức, TP. HCM'
    },
    footerSlogan: 'Không gian đẹp – Cuộc sống chất 🤎'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1920&q=80',
    logo: 'SONTD',
    slogan: 'NỘI THẤT CHO CUỘC SỐNG HOÀN HẢO',
    title: (
      <>
        KHÁM PHÁ <span className="text-[#8B5E3C]">BỘ SƯU TẬP</span><br />
        XU HƯỚNG MỚI<br />
        <span className="italic font-serif text-[#C49A6C] font-normal">Nâng tầm phong cách</span>
      </>
    ),
    description: 'Tìm kiếm cảm hứng thiết kế từ bộ sưu tập mới nhất của chúng tôi, đem lại sự sang trọng và thoải mái cho từng góc nhỏ ngôi nhà bạn.',
    cta: 'XEM BỘ SƯU TẬP',
    link: '/products',
    website: 'WWW.SONTD.VN',
    commitments: [
      { text: 'THIẾT KẾ ĐỘC QUYỀN', desc: 'Mang đậm dấu ấn cá nhân' },
      { text: 'CHẤT LIỆU CAO CẤP', desc: 'Đạt chuẩn xuất khẩu quốc tế' },
      { text: 'BẢO TRÌ TRỌN ĐỜI', desc: 'Luôn bên bạn suốt hành trình' }
    ],
    footerSlogan: 'Đồng hành cùng gia đình Việt'
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${apiUrl}/api/products?limit=20`),
          fetch(`${apiUrl}/api/products/categories`)
        ]);
        const pData = await pRes.json();
        const cData = await cRes.json();
        if (pData.success && pData.data?.products) setProducts(pData.data.products);
        if (cData.success) setCategories(cData.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [apiUrl]);

  // Autoplay functionality for the hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.discount_pct > 0).slice(0, 4);
  const bestSellers = products.slice(0, 8);
  const suggestedProducts = products.slice(0, 4);

  const reviews = [
    { name: 'yaluomai0011', rating: 5, text: 'Ngược dẫn có cần chuyên cần ghế thoáng kiểu bất cứ, ổn cược ngoài nốt.', img: '/uploads/products/pro_mau_tu_nhien_giuong_go_cao_su_vline_noi_that_moho_1_641eaf90df4045019e8c134068caa1c2_large.png' },
    { name: 'Hồ Quang Nhật', rating: 5, text: 'Mẫu mua ghế thoáng có bàn, căn phòng cũng sẽ đẹp và thiết kế bền chặt.', img: '/uploads/products/pro_nem_foam_moho_signature_02aeec7858054cf3892c50c11138f1e6_grande.png' },
    { name: 'Ẩn Danh', rating: 5, text: 'Mình đặt cho showroom rất đẹ, phù hợp thiết kế nghệ sĩ gọi nhàng dẫy xin prim.', img: '/uploads/products/pro_mau_tu_nhien_bo_ban_an_4_ghe_6_ghe_serena_noi_that_moho_ban_an_1m6_238807752ee145c19f3e3ccdb43977d6_grande.jpg' },
    { name: 'HuyenLu', rating: 5, text: 'Bàn chuyển hát bán tại mỹ xinh nhà, mua SONTD thấy giống mô tả rất bền.', img: '/uploads/products/noi-that-moho-sofa-vline-ban-sofa-milan_8e1b7b077e39491785f02cc4b9665b23_large.jpg' },
  ];

  return (
    <div className="flex flex-col bg-gray-50">
      {/* ===== HERO SLIDER ===== */}
      <section className="relative h-[620px] md:h-[660px] lg:h-[720px] bg-white overflow-hidden flex flex-col justify-between">
        {/* Background images fade transitions */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: idx === currentSlide ? "scale(1.05)" : "scale(1)",
                }}
              />
              {/* White Fade Overlay: fades from solid white on left to transparent on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent max-lg:bg-white/95" />
            </div>
          ))}
        </div>

        {/* Content Container (Absolutely Positioned to support fixed layout) */}
        <div className="absolute inset-x-0 top-0 bottom-24 z-20 flex items-center">
          <div className="container mx-auto px-6 md:px-10">
            <div className="w-full lg:max-w-xl xl:max-w-2xl space-y-6">
              {/* Header: Brand and Tagline */}
              <div className="flex items-center gap-3">
                <span className="font-serif font-black text-2xl tracking-widest text-[#5D4037]">{slides[currentSlide].logo}</span>
                <span className="text-[10px] md:text-xs font-semibold tracking-wider text-gray-500 border-l border-gray-300 pl-3">
                  {slides[currentSlide].slogan}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight">
                {slides[currentSlide].title}
              </h1>

              {/* Description */}
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-lg">
                {slides[currentSlide].description}
              </p>

              {/* Promo Box (Slide 2 specific) */}
              {slides[currentSlide].promo && (
                <div className="bg-[#F5F2EB] border border-[#E4DCD3] rounded-xl p-4 flex items-center gap-4 max-w-sm">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {slides[currentSlide].promo.title}
                    </p>
                    <p className="text-xl font-black text-[#8B5E3C] leading-none my-0.5">
                      {slides[currentSlide].promo.value}
                    </p>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">
                      {slides[currentSlide].promo.desc}
                    </p>
                  </div>
                </div>
              )}

              {/* Core badges/features list */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M7 8V5a2 2 0 012-2h6a2 2 0 012 2v3" />
                      </svg>
                    ),
                    l1: "THIẾT KẾ",
                    l2: "HIỆN ĐẠI"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    ),
                    l1: "CHẤT LƯỢNG",
                    l2: "BỀN VỮNG"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5 3v6a7 7 0 007 7M19 3v6a7 7 0 01-7 7" />
                      </svg>
                    ),
                    l1: "VẬT LIỆU",
                    l2: "THÂN THIỆN"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    ),
                    l1: "TIỆN NGHI",
                    l2: "& TINH TẾ"
                  }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg">{badge.icon}</div>
                    <div className="text-[10px] font-bold text-gray-700 leading-tight uppercase">
                      <p>{badge.l1}</p>
                      <p>{badge.l2}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-2">
                <Link
                  href={slides[currentSlide].link}
                  className="bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold py-3.5 px-8 rounded-xl inline-flex items-center gap-2 text-xs transition tracking-widest shadow-lg uppercase"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {slides[currentSlide].cta}
                </Link>
                {slides[currentSlide].website && (
                  <a
                    href={`https://${slides[currentSlide].website.toLowerCase()}`}
                    className="flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-gray-900 transition tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {slides[currentSlide].website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/40 hover:bg-white/95 text-gray-700 hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition shadow-md max-md:hidden"
        >
          ⟨
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/40 hover:bg-white/95 text-gray-700 hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition shadow-md max-md:hidden"
        >
          ⟩
        </button>

        {/* Navigation Indicator Dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-[#8B5E3C] w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Bottom Banner (Footer bar inside slide) - Absolutely Positioned at bottom */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-[#3E2723] text-white py-4 border-t border-[#4E342E]">
          <div className="container mx-auto px-6 md:px-10">
            {slides[currentSlide].whyChooseUs ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] md:text-xs font-bold tracking-widest text-amber-400">
                    — VÌ SAO CHỌN SONTD? —
                  </p>
                  <p className="text-xs italic text-gray-300 max-md:hidden font-serif">
                    {slides[currentSlide].footerSlogan}
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  {slides[currentSlide].whyChooseUs.map((item, idx) => (
                    <div key={idx} className="border-l border-white/10 pl-3">
                      <h4 className="text-[10px] md:text-xs font-bold text-amber-300 uppercase">
                        {item.title}
                      </h4>
                      <p className="text-[9px] md:text-[10px] text-gray-300 mt-0.5 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                {slides[currentSlide].contactInfo && (
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-[9px] md:text-[10px] text-gray-300">
                    <div className="flex items-center gap-4">
                      <span>🌐 {slides[currentSlide].contactInfo.website}</span>
                      <span>📞 Hotline: {slides[currentSlide].contactInfo.hotline}</span>
                      <span>📍 Showroom: {slides[currentSlide].contactInfo.showroom}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                  {slides[currentSlide].commitments.map((commit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-amber-400 text-base">✓</span>
                      <div>
                        <span className="font-bold uppercase text-[10px] md:text-xs text-amber-300">
                          {commit.text}
                        </span>
                        <span className="mx-2 text-white/40 max-md:hidden">|</span>
                        <span className="text-gray-300 text-[10px] md:text-xs">
                          {commit.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="italic text-gray-200 font-serif text-right shrink-0">
                  {slides[currentSlide].footerSlogan}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SERVICES BAR ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5">
            {[
              { icon: '🚚', t: 'Giao hàng miễn phí', d: 'Đơn từ 5.000.000đ' },
              { icon: '🔄', t: 'Đổi trả 30 ngày', d: 'Miễn phí đổi trả' },
              { icon: '🛡️', t: 'Bảo hành 5 năm', d: 'Cam kết chất lượng' },
              { icon: '💬', t: 'Tư vấn 24/7', d: 'Hỗ trợ chuyên nghiệp' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{s.t}</h4>
                  <p className="text-[11px] text-gray-400">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIÁ SIÊU TỐT ===== */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeader title="Giá siêu tốt" href="/products" color="#e74c3c" />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(dealProducts.length > 0 ? dealProducts : products.slice(0, 4)).map(p => (
                <ProductCard key={p.id} product={p} badge="HOT" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BÁN CHẠY ===== */}
      <section className="py-8 bg-white border-t border-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeader title="Bán chạy" href="/products" color="#e67e22" />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestSellers.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== WARRANTY BANNER ===== */}
      <section className="py-6 bg-white border-t border-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bảo hành banner */}
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 flex items-center gap-5 border border-amber-200/50 overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
              <div className="bg-white rounded-xl p-4 shadow-sm flex-shrink-0 relative z-10">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">NỘI THẤT SONDT</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">Bảo Hành 5 Năm</p>
                  <p className="text-xs text-gray-500 mt-1">cho mọi sản phẩm chính hãng</p>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-gray-800 text-lg mb-1">An tâm sử dụng</h3>
                <p className="text-sm text-gray-500">Đổi mới 1-1 nếu lỗi nhà sản xuất. Bảo trì trọn đời miễn phí.</p>
              </div>
            </div>
            {/* Liên hệ */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 flex items-center gap-5 border border-blue-200/50">
              <div className="bg-white rounded-xl p-4 shadow-sm flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl">📞</p>
                  <p className="text-lg font-black text-blue-600 mt-1">Hotline</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Liên Hệ Tư Vấn</h3>
                <p className="text-2xl font-black text-blue-600">0971 141 140</p>
                <p className="text-xs text-gray-500 mt-1">Miễn phí tư vấn • Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GỢI Ý ===== */}
      <section className="py-8 bg-white border-t border-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeader title="Gợi Ý Cho Bạn" href="/products" color="#2ecc71" />
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== DANH MỤC NỔI BẬT ===== */}
      <section className="py-8 bg-white border-t border-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeader title="Danh Mục Nổi Bật" href="/products" color="#8e44ad" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Phòng Ngủ', icon: '🛏️', slug: 'giuong-ngu', color: 'from-blue-50 to-indigo-50', border: 'border-blue-200/50' },
              { name: 'Sofa', icon: '🛋️', slug: 'sofa', color: 'from-green-50 to-emerald-50', border: 'border-green-200/50' },
              { name: 'Bàn Ăn', icon: '🍽️', slug: 'ban-an', color: 'from-amber-50 to-orange-50', border: 'border-amber-200/50' },
              { name: 'Nệm', icon: '🌙', slug: 'nem-foam', color: 'from-purple-50 to-pink-50', border: 'border-purple-200/50' },
            ].map((cat, i) => (
              <Link key={i} href={`/products?category=${cat.slug}`}
                className={`group bg-gradient-to-br ${cat.color} rounded-xl p-6 border ${cat.border} hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1`}>
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <h3 className="font-bold text-gray-800 text-base">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Xem tất cả →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ĐÁNH GIÁ THỰC TẾ ===== */}
      <section className="py-10 bg-white border-t border-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeader title="Đánh giá thực tế" color="#e67e22" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{r.name}</h4>
                  <div className="text-orange-400 text-xs mb-2">★★★★★</div>
                  <p className="text-xs text-gray-500 line-clamp-2">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BÁO CHÍ ===== */}
      <section className="py-10 bg-white border-t border-gray-50">
        <div className="container mx-auto px-6">
          <SectionHeader title="Báo chí nói về SONDT" color="#3498db" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: '[Advertising Vietnam] SONDT Furniture – Thương hiệu nội thất Việt uy tín', date: '15/03/2026' },
              { title: '[Báo Tiền Phong] Nội thất SONDT đạt chuẩn xuất khẩu', date: '20/02/2026' },
              { title: '[Báo Công Thương] Nội thất SONDT phát triển bền vững', date: '10/01/2026' },
              { title: '[VnExpress] SONDT – Giải pháp nội thất thông minh cho gia đình Việt', date: '05/12/2025' },
            ].map((news, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition cursor-pointer group">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 text-blue-600 text-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  📰
                </div>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition leading-snug">{news.title}</h4>
                <p className="text-xs text-gray-400">{news.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2118 50%, #1a1a1a 100%)' }}>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#d4a843]"></div>
            <span className="text-[#d4a843] text-xs font-semibold uppercase tracking-[0.25em]">Ưu đãi</span>
            <div className="w-8 h-[1px] bg-[#d4a843]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight max-w-2xl mx-auto">
            Tư Vấn Thiết Kế <span style={{ color: '#d4a843' }}>Miễn Phí</span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto mb-8">
            Đội ngũ kiến trúc sư của SONDT sẵn sàng giúp bạn thiết kế không gian sống hoàn hảo.
          </p>
          <Link href="/design" className="inline-block text-white font-semibold py-3.5 px-10 text-sm uppercase tracking-widest transition-all duration-500 hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]" style={{ background: 'linear-gradient(135deg, #b8860b, #d4a843)' }}>
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
