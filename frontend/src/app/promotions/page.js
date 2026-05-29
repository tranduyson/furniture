'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromotionsPage() {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const imgUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/promotions`);
        const data = await res.json();
        if (data.success) {
          setDiscountedProducts(data.data.discounted_products || []);
          setCoupons(data.data.coupons || []);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchPromotions();
  }, [apiUrl]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Countdown timer component
  const CountdownTimer = () => {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 15);
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;
        if (distance < 0) { clearInterval(timer); return; }
        setTime({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className="flex gap-3 justify-center">
        {[
          { val: time.days, label: 'Ngày' },
          { val: time.hours, label: 'Giờ' },
          { val: time.minutes, label: 'Phút' },
          { val: time.seconds, label: 'Giây' },
        ].map((t, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-extrabold text-white">{String(t.val).padStart(2, '0')}</span>
            </div>
            <span className="text-[10px] text-amber-300/80 uppercase tracking-widest mt-2 font-semibold">{t.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white">
      {/* ===== COUNTDOWN PROMO BAR ===== */}
      <section className="relative py-8 text-center overflow-hidden border-b border-gray-100"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2118 50%, #1a1a1a 100%)' }}>
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-3 py-1 mb-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Đang diễn ra</span>
            </div>
            <h2 className="text-lg font-bold text-white">Săn Deal Hấp Dẫn - Giảm Đến 50%</h2>
            <p className="text-xs text-gray-400 mt-0.5">Số lượng sản phẩm khuyến mãi có hạn. Hãy nhanh tay chọn mua!</p>
          </div>
          <CountdownTimer />
        </div>
      </section>

      {/* ===== COUPON CODES ===== */}
      {coupons.length > 0 && (
        <section className="py-12 md:py-16" style={{ background: '#f9f6f2' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-[1px] bg-[#b8860b]" />
                <span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Mã giảm giá</span>
                <div className="w-8 h-[1px] bg-[#b8860b]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Nhập Mã — Nhận Ưu Đãi Ngay</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {coupons.map((coupon) => (
                <div key={coupon.id}
                  className="relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                  {/* Dashed border left */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(180deg, #b8860b, #d4a843)' }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block bg-amber-50 text-[#b8860b] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider mb-2">
                          {coupon.discount_type === 'percentage' ? `Giảm ${Number(coupon.discount_value)}%` : `Giảm ${formatPrice(coupon.discount_value)}`}
                        </span>
                        <h3 className="font-bold text-gray-900 text-lg">{coupon.code}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a843] flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Đơn tối thiểu {formatPrice(coupon.min_order_value)}
                      {coupon.expires_at && ` • HSD: ${new Date(coupon.expires_at).toLocaleDateString('vi-VN')}`}
                    </p>
                    <button onClick={() => copyCode(coupon.code)}
                      className="w-full py-2.5 border-2 border-dashed border-[#b8860b]/40 rounded-lg text-[#b8860b] font-bold text-sm uppercase tracking-wider hover:bg-[#b8860b] hover:text-white hover:border-solid transition-all duration-300">
                      {copiedCode === coupon.code ? '✓ Đã sao chép!' : 'Sao chép mã'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== DISCOUNTED PRODUCTS ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-red-500" />
                <span className="text-red-500 text-xs font-semibold uppercase tracking-[0.25em]">Flash Sale</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Sản Phẩm Đang Giảm Giá</h2>
              <p className="text-gray-500 text-base">Nhanh tay chọn mua — Ưu đãi có thời hạn!</p>
            </div>
            <Link href="/products"
              className="inline-flex items-center gap-2 text-[#b8860b] font-semibold text-sm uppercase tracking-widest hover:gap-3 transition-all border-b border-[#b8860b]/30 pb-1">
              Xem tất cả <span>&rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-gray-50 rounded-sm">
                  <div className="bg-gray-200 aspect-square" />
                  <div className="p-5"><div className="h-4 bg-gray-200 rounded w-1/3 mb-3" /><div className="h-5 bg-gray-200 rounded w-full mb-3" /><div className="h-5 bg-gray-200 rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : discountedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {discountedProducts.map(product => (
                <Link href={`/products/${product.slug}`} key={product.id}
                  className="group bg-white rounded-sm overflow-hidden border border-gray-100 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 flex flex-col">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.primary_image ? (
                      <img src={imgUrl(product.primary_image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 z-10 uppercase tracking-wider rounded-sm">
                      -{product.discount_pct}%
                    </span>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 cursor-pointer">
                      <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                      <button className="w-full bg-[#1a1a1a]/90 backdrop-blur text-white py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition rounded-sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[10px] font-semibold text-[#b8860b] uppercase tracking-widest mb-2">{product.category_name || 'Nội thất'}</p>
                    <h3 className="text-base text-gray-900 font-semibold mb-3 line-clamp-2 group-hover:text-[#b8860b] transition flex-grow leading-snug">{product.name}</h3>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                      <span className="text-lg font-bold text-red-600">{formatPrice(product.base_price * (1 - product.discount_pct / 100))}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.base_price)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                        Tiết kiệm {formatPrice(product.base_price * product.discount_pct / 100)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
              </div>
              <p className="text-gray-400 text-lg">Hiện chưa có sản phẩm khuyến mãi nào.</p>
              <Link href="/products" className="inline-block mt-4 text-[#b8860b] font-semibold hover:underline">Khám phá sản phẩm →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-14" style={{ background: '#f9f6f2' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🏷️', title: 'Giá tốt nhất', desc: 'Cam kết giá tốt nhất thị trường' },
              { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 5.000.000đ' },
              { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Không rủi ro khi mua sắm' },
              { icon: '🛡️', title: 'Bảo hành 5 năm', desc: 'Chất lượng được đảm bảo' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2118 50%, #1a1a1a 100%)' }}>
        <div className="absolute inset-0 animate-shimmer" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Đừng Bỏ Lỡ <span style={{ color: '#d4a843' }}>Cơ Hội</span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto mb-8">
            Đăng ký nhận thông báo ưu đãi để không bỏ lỡ bất kỳ deal hot nào từ SONDT Furniture.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Nhập email của bạn..."
              className="flex-1 px-5 py-3.5 rounded-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-[#d4a843] focus:ring-0 text-sm" />
            <button className="px-8 py-3.5 text-white font-semibold text-sm uppercase tracking-widest transition-all duration-500 hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]"
              style={{ background: 'linear-gradient(135deg, #b8860b, #d4a843)' }}>
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
