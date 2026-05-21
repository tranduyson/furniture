'use client';
import { useState } from 'react';
import Link from 'next/link';

const services = [
  { icon:'📐', title:'Tư Vấn & Đo Đạc', desc:'Đội ngũ kiến trúc sư đến tận nhà đo đạc, khảo sát không gian và lắng nghe yêu cầu của bạn hoàn toàn miễn phí.', features:['Khảo sát tại nhà miễn phí','Tư vấn phong cách phù hợp','Đo đạc chính xác bằng laser'] },
  { icon:'🎨', title:'Thiết Kế 3D', desc:'Phối cảnh 3D chân thực giúp bạn hình dung rõ ràng không gian sống trước khi thi công, có thể chỉnh sửa theo ý muốn.', features:['Render 3D photo-realistic','Chỉnh sửa không giới hạn','Bản vẽ kỹ thuật chi tiết'] },
  { icon:'🔨', title:'Thi Công Trọn Gói', desc:'Thi công nội thất từ A-Z với đội ngũ thợ lành nghề, giám sát chất lượng nghiêm ngặt và tiến độ cam kết.', features:['Thợ lành nghề 10+ năm','Giám sát chất lượng 3 lớp','Cam kết đúng tiến độ'] },
  { icon:'✨', title:'Bàn Giao & Bảo Hành', desc:'Bàn giao sạch sẽ, hoàn thiện đến từng chi tiết. Bảo hành dài hạn lên đến 5 năm cho toàn bộ công trình.', features:['Vệ sinh sau thi công','Bảo hành 5 năm','Bảo trì định kỳ miễn phí'] },
];

const projects = [
  { title:'Căn Hộ Vinhomes Central Park', area:'95m²', style:'Scandinavian', duration:'45 ngày', location:'TP. Hồ Chí Minh', img:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80' },
  { title:'Biệt Thự Thảo Điền', area:'280m²', style:'Modern Luxury', duration:'90 ngày', location:'TP. Hồ Chí Minh', img:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80' },
  { title:'Penthouse Sky Lake', area:'180m²', style:'Japandi', duration:'60 ngày', location:'Hà Nội', img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { title:'Nhà Phố Ciputra', area:'150m²', style:'Contemporary', duration:'55 ngày', location:'Hà Nội', img:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80' },
  { title:'Căn Hộ The Marq', area:'120m²', style:'Minimalist', duration:'50 ngày', location:'TP. Hồ Chí Minh', img:'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80' },
  { title:'Villa Ecopark', area:'320m²', style:'Indochine', duration:'100 ngày', location:'Hưng Yên', img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
];

const packages = [
  { name:'Gói Cơ Bản', price:'Từ 8.5 triệu/m²', desc:'Phù hợp cho căn hộ chung cư cần hoàn thiện nội thất cơ bản.', items:['Thiết kế 2D + 3D','Thi công phần cứng','Nội thất phòng khách','Nội thất phòng ngủ','Bảo hành 3 năm'], highlight:false },
  { name:'Gói Cao Cấp', price:'Từ 15 triệu/m²', desc:'Giải pháp trọn gói cho không gian sống đẳng cấp, đầy đủ tiện nghi.', items:['Thiết kế 3D Render HD','Thi công trọn gói A-Z','Full nội thất tất cả phòng','Đèn trang trí & phụ kiện','Smart Home cơ bản','Bảo hành 5 năm'], highlight:true },
  { name:'Gói Biệt Thự', price:'Từ 20 triệu/m²', desc:'Dành cho biệt thự, penthouse — không gian sống hoàn hảo đến chi tiết.', items:['Thiết kế Concept độc quyền','Vật liệu nhập khẩu','Nội thất gỗ tự nhiên','Hệ thống Smart Home','Sân vườn & ngoại thất','Bảo hành 5 năm + bảo trì'], highlight:false },
];

const steps = [
  { step:'01', title:'Liên Hệ & Tư Vấn', desc:'Gọi hotline hoặc đặt lịch online. Đội ngũ sẽ tư vấn sơ bộ về nhu cầu và ngân sách.' },
  { step:'02', title:'Khảo Sát & Đo Đạc', desc:'Kiến trúc sư đến tận nơi khảo sát, đo đạc và lên ý tưởng thiết kế.' },
  { step:'03', title:'Thiết Kế & Duyệt', desc:'Bản thiết kế 3D được trình bày. Chỉnh sửa cho đến khi bạn hoàn toàn hài lòng.' },
  { step:'04', title:'Ký Hợp Đồng', desc:'Thỏa thuận chi phí, tiến độ rõ ràng. Thanh toán theo giai đoạn.' },
  { step:'05', title:'Thi Công', desc:'Đội ngũ thợ lành nghề thi công, giám sát chất lượng nghiêm ngặt mỗi ngày.' },
  { step:'06', title:'Bàn Giao', desc:'Kiểm tra nghiệm thu, bàn giao sạch sẽ và kích hoạt bảo hành chính hãng.' },
];

export default function DesignPage() {
  const [activeProject, setActiveProject] = useState(0);
  return (
    <div className="flex flex-col bg-white">
      {/* Intro Block */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-bold uppercase tracking-[0.25em] font-sans">THIẾT KẾ - THI CÔNG TRỌN GÓI</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 font-serif leading-tight">Biến Ý Tưởng Thành Không Gian Sống</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">Dịch vụ thiết kế & thi công nội thất trọn gói từ SONDT — Từ bản vẽ phối cảnh 3D chân thực đến bàn giao chìa khóa trao tay với chất lượng hoàn thiện vượt trội.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="#packages" className="group relative overflow-hidden text-white font-semibold py-3 px-6 text-xs uppercase tracking-widest transition-all duration-500" style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>
                <span className="relative z-10">Xem bảng giá dịch vụ</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"/>
              </a>
              <a href="tel:0326330991" className="border border-gray-300 text-gray-700 hover:text-[#b8860b] hover:border-[#b8860b] font-semibold py-3 px-6 text-xs uppercase tracking-widest transition-all duration-300">Tư vấn miễn phí</a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1a1a1a] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[{n:'500+',l:'Dự án hoàn thành'},{n:'98%',l:'Khách hài lòng'},{n:'50+',l:'Kiến trúc sư'},{n:'5 năm',l:'Bảo hành'}].map((s,i)=>(
              <div key={i} className="py-8 md:py-10 text-center"><div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.n}</div><div className="text-gray-500 text-xs uppercase tracking-widest">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Dịch vụ</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Quy Trình <span style={{color:'#b8860b'}}>Chuyên Nghiệp</span></h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Từ ý tưởng đến hiện thực, mỗi bước đều được thực hiện tỉ mỉ và chuyên nghiệp.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s,i)=>(
              <div key={i} className="group p-7 bg-white border border-gray-100 rounded-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#b8860b] transition">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f,j)=>(
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-[#b8860b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-20 md:py-28" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Dự án tiêu biểu</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Công Trình <span style={{color:'#b8860b'}}>Đã Thực Hiện</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p,i)=>(
              <div key={i} className="group bg-white rounded-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"/>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                    <span className="text-white text-sm font-semibold">{p.location}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-[#b8860b] transition">{p.title}</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 rounded py-2 px-1">
                      <div className="text-xs font-bold text-gray-900">{p.area}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Diện tích</div>
                    </div>
                    <div className="bg-gray-50 rounded py-2 px-1">
                      <div className="text-xs font-bold text-gray-900">{p.style}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Phong cách</div>
                    </div>
                    <div className="bg-gray-50 rounded py-2 px-1">
                      <div className="text-xs font-bold text-gray-900">{p.duration}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Thời gian</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Quy trình</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">6 Bước <span style={{color:'#b8860b'}}>Đơn Giản</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((s,i)=>(
              <div key={i} className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a843] flex items-center justify-center text-white font-extrabold text-sm">{s.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PACKAGES */}
      <section id="packages" className="py-20 md:py-28" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Bảng giá</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Gói Dịch Vụ <span style={{color:'#b8860b'}}>Thi Công</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg,i)=>(
              <div key={i} className={`relative rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 ${pkg.highlight?'border-2 border-[#b8860b] shadow-xl bg-white':'border border-gray-200 bg-white hover:shadow-lg'}`}>
                {pkg.highlight&&<div className="bg-gradient-to-r from-[#b8860b] to-[#d4a843] text-white text-center py-2 text-xs font-bold uppercase tracking-widest">Phổ biến nhất</div>}
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <div className="text-2xl font-extrabold text-[#b8860b] mb-3">{pkg.price}</div>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{pkg.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {pkg.items.map((item,j)=>(
                      <li key={j} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-[#b8860b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="tel:0326330991" className={`block w-full text-center py-3 font-semibold text-sm uppercase tracking-widest transition-all ${pkg.highlight?'text-white':'text-[#b8860b] border border-[#b8860b] hover:bg-[#b8860b] hover:text-white'}`} style={pkg.highlight?{background:'linear-gradient(135deg,#b8860b,#d4a843)'}:{}}>
                    Liên hệ tư vấn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#2d2118 50%,#1a1a1a 100%)'}}>
        <div className="absolute inset-0 animate-shimmer"/>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">Bắt Đầu Dự Án Của Bạn <span style={{color:'#d4a843'}}>Ngay Hôm Nay</span></h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto mb-8">Đặt lịch tư vấn miễn phí với kiến trúc sư của SONDT. Chúng tôi sẵn sàng biến ngôi nhà bạn thành tác phẩm nghệ thuật.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0326330991" className="text-white font-semibold py-3.5 px-10 text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(184,134,11,0.3)] transition-all" style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>Gọi ngay: 0326 330 991</a>
            <Link href="/products" className="border border-white/25 text-white/80 hover:text-white hover:border-white/60 font-semibold py-3.5 px-10 text-sm uppercase tracking-widest transition-all">Xem sản phẩm</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
