'use client';
import { useState } from 'react';
import Link from 'next/link';

const stores = [
  { id:1, name:'SONDT Tây Hồ — Flagship', address:'123 Phố Yên Phụ, Quận Tây Hồ, Hà Nội', province:'Hà Nội', phone:'0326 330 991', email:'tayho@sondt.vn', hours:'09:00 – 22:00', type:'flagship', mapUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.47!2d105.8456!3d21.0524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAzJzA4LjYiTiAxMDXCsDUwJzQ0LjIiRQ!5e0!3m2!1svi!2svn!4v1' },
  { id:2, name:'SONDT Cầu Giấy', address:'456 Đường Xuân Thuỷ, Quận Cầu Giấy, Hà Nội', province:'Hà Nội', phone:'0326 330 992', email:'caugiay@sondt.vn', hours:'09:00 – 21:30', type:'showroom', mapUrl:'' },
  { id:3, name:'SONDT Quận 1 — Flagship', address:'789 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', province:'TP. HCM', phone:'0326 330 993', email:'quan1@sondt.vn', hours:'09:00 – 22:00', type:'flagship', mapUrl:'' },
  { id:4, name:'SONDT Quận 7', address:'101 Đường Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh', province:'TP. HCM', phone:'0326 330 994', email:'quan7@sondt.vn', hours:'09:00 – 21:30', type:'showroom', mapUrl:'' },
  { id:5, name:'SONDT Đà Nẵng', address:'202 Đường Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng', province:'Đà Nẵng', phone:'0326 330 995', email:'danang@sondt.vn', hours:'09:00 – 21:00', type:'showroom', mapUrl:'' },
  { id:6, name:'SONDT Hải Phòng', address:'88 Đường Lạch Tray, Quận Ngô Quyền, Hải Phòng', province:'Hải Phòng', phone:'0326 330 996', email:'haiphong@sondt.vn', hours:'09:00 – 21:00', type:'showroom', mapUrl:'' },
];
const provinces = ['Tất cả',...new Set(stores.map(s=>s.province))];

export default function StoresPage() {
  const [selected, setSelected] = useState('Tất cả');
  const [activeStore, setActiveStore] = useState(stores[0]);
  const filtered = selected === 'Tất cả' ? stores : stores.filter(s=>s.province===selected);

  return (
    <div className="flex flex-col bg-white">
      {/* HERO */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#2d2118 40%,#1a1a1a 100%)'}}>
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-amber-700/10 blur-[100px]"/>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#d4a843]"/><span className="text-[#d4a843] text-xs font-semibold uppercase tracking-[0.25em]">Hệ thống cửa hàng</span><div className="w-8 h-[1px] bg-[#d4a843]"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Trải Nghiệm <span style={{color:'#d4a843'}}>Trực Tiếp</span></h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto">Ghé thăm showroom SONDT gần nhất để trải nghiệm sản phẩm và nhận tư vấn miễn phí từ chuyên gia.</p>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1a1a1a] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[{n:'6',l:'Cửa hàng'},{n:'4',l:'Tỉnh thành'},{n:'2',l:'Flagship'}].map((s,i)=>(
              <div key={i} className="py-8 text-center"><div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.n}</div><div className="text-gray-500 text-xs uppercase tracking-widest">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* FILTER */}
          <div className="flex flex-wrap gap-2 mb-10">
            {provinces.map(p=>(
              <button key={p} onClick={()=>setSelected(p)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selected===p?'bg-[#1a1a1a] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* STORE LIST */}
            <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {filtered.map(store=>(
                <div key={store.id} onClick={()=>setActiveStore(store)}
                  className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 ${activeStore.id===store.id?'border-[#b8860b] bg-[#fdfbf7] shadow-md':'border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
                    {store.type==='flagship'&&<span className="text-[9px] bg-[#b8860b] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">Flagship</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{store.address}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {store.hours}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      {store.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* MAP & DETAIL */}
            <div className="lg:col-span-2">
              <div className="bg-gray-100 rounded-sm overflow-hidden aspect-[16/9] mb-6">
                {activeStore.mapUrl ? (
                  <iframe src={activeStore.mapUrl} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <p className="text-sm font-medium">{activeStore.name}</p>
                    <p className="text-xs mt-1">{activeStore.address}</p>
                  </div>
                )}
              </div>
              {/* DETAIL CARD */}
              <div className="bg-[#fdfbf7] border border-[#b8860b]/15 rounded-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{activeStore.name}</h3>
                    {activeStore.type==='flagship'&&<span className="text-[10px] bg-[#b8860b] text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">Flagship Store</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                    <div><p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">Địa chỉ</p><p className="text-gray-600">{activeStore.address}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <div><p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">Giờ mở cửa</p><p className="text-gray-600">Thứ Hai – Chủ Nhật: {activeStore.hours}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                    <div><p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">Điện thoại</p><p className="text-gray-600">{activeStore.phone}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                    <div><p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">Email</p><p className="text-gray-600">{activeStore.email}</p></div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`tel:${activeStore.phone.replace(/\s/g,'')}`} className="px-6 py-2.5 text-white font-semibold text-sm uppercase tracking-wider" style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>Gọi ngay</a>
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(activeStore.address)}`} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold text-sm uppercase tracking-wider hover:bg-gray-50 transition">Chỉ đường</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Không Thể Đến Showroom?</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto mb-6">Đặt lịch tư vấn online miễn phí hoặc mua sắm trực tuyến với giao hàng toàn quốc.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="px-8 py-3 text-white font-semibold text-sm uppercase tracking-widest" style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>Mua sắm online</Link>
            <a href="tel:0326330991" className="px-8 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold text-sm uppercase tracking-widest transition-all">Đặt lịch tư vấn</a>
          </div>
        </div>
      </section>
    </div>
  );
}
