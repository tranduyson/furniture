'use client';
import { useState } from 'react';
import Link from 'next/link';

const posts = [
  { id:1, cat:'Tips', date:'12/05/2026', title:'10 Bí Quyết Chọn Sofa Phù Hợp Cho Phòng Khách Nhỏ', excerpt:'Hướng dẫn chi tiết cách lựa chọn sofa tối ưu không gian sống.', time:8, views:1240, img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { id:2, cat:'Inspiration', date:'08/05/2026', title:'Xu Hướng Nội Thất Tối Giản 2026: Ít Hơn Là Nhiều Hơn', excerpt:'Phong cách minimalist tiếp tục thống trị thế giới nội thất năm nay.', time:6, views:980, img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { id:3, cat:'Thi công', date:'01/05/2026', title:'Dự Án Biệt Thự Thảo Điền — Gỗ Tự Nhiên Kể Chuyện', excerpt:'Thi công nội thất trọn gói cho biệt thự cao cấp tại Thảo Điền.', time:10, views:2100, img:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80' },
  { id:4, cat:'Tips', date:'25/04/2026', title:'Cách Bảo Quản Nội Thất Gỗ Bền Đẹp Theo Thời Gian', excerpt:'Mẹo đơn giản giúp đồ gỗ luôn sáng bóng và bền bỉ.', time:5, views:760, img:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80' },
  { id:5, cat:'Media', date:'18/04/2026', title:'SONDT Nhận Giải Top 10 Thương Hiệu Nội Thất Uy Tín', excerpt:'SONDT được vinh danh trong Top 10 Nội thất được tin chọn 2026.', time:4, views:3200, img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { id:6, cat:'Inspiration', date:'10/04/2026', title:'Phòng Ngủ Phong Cách Japandi — Giao Thoa Đông Tây', excerpt:'Sự kết hợp hoàn hảo giữa tối giản Nhật Bản và ấm cúng Scandinavian.', time:7, views:1560, img:'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80' },
];
const cats = ['Tất cả','Tips','Inspiration','Thi công','Media'];

export default function BlogPage() {
  const [active, setActive] = useState('Tất cả');
  const filtered = active === 'Tất cả' ? posts : posts.filter(p => p.cat === active);
  const ft = posts[0];
  return (
    <div className="flex flex-col bg-white">
      {/* HERO */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#2d2118 40%,#1a1a1a 100%)'}}>
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-amber-700/10 blur-[100px]"/>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#d4a843]"/><span className="text-[#d4a843] text-xs font-semibold uppercase tracking-[0.25em]">Blog & Tin tức</span><div className="w-8 h-[1px] bg-[#d4a843]"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Cảm Hứng <span style={{color:'#d4a843'}}>Nội Thất</span></h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto">Cập nhật xu hướng, ý tưởng thiết kế và câu chuyện thương hiệu từ SONDT.</p>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden group">
              <img src={ft.img} alt={ft.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
              <span className="absolute top-4 left-4 bg-[#b8860b] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">{ft.cat}</span>
            </div>
            <div className="lg:pl-6">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4"><span>{ft.date}</span><span>•</span><span>{ft.time} phút đọc</span><span>•</span><span>{ft.views.toLocaleString()} lượt xem</span></div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight hover:text-[#b8860b] transition cursor-pointer">{ft.title}</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">{ft.excerpt}</p>
              <button className="inline-flex items-center gap-2 text-[#b8860b] font-semibold text-sm uppercase tracking-widest hover:gap-3 transition-all border-b border-[#b8860b]/30 pb-1">Đọc tiếp <span>&rarr;</span></button>
            </div>
          </div>
          {/* FILTER */}
          <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-100 pb-6">
            {cats.map(c=>(<button key={c} onClick={()=>setActive(c)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${active===c?'bg-[#1a1a1a] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>))}
          </div>
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p=>(
              <article key={p.id} className="group cursor-pointer">
                <div className="relative aspect-[3/2] rounded-sm overflow-hidden mb-5">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#b8860b] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">{p.cat}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3"><span>{p.date}</span><span>•</span><span>{p.time} phút đọc</span></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#b8860b] transition leading-snug line-clamp-2">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{p.excerpt}</p>
              </article>
            ))}
          </div>
          {filtered.length===0&&<div className="text-center py-20 text-gray-400">Chưa có bài viết nào trong danh mục này.</div>}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Đăng Ký Nhận Bản Tin</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto mb-8">Cập nhật bài viết mới, xu hướng nội thất và ưu đãi độc quyền mỗi tuần.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Nhập email của bạn..." className="flex-1 px-5 py-3 border border-gray-300 rounded-sm text-sm focus:border-[#b8860b]"/>
            <button className="px-8 py-3 text-white font-semibold text-sm uppercase tracking-widest" style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>Đăng ký</button>
          </div>
        </div>
      </section>
    </div>
  );
}
