'use client';
import Link from 'next/link';

const timeline = [
  { year:'2020', title:'Khởi Đầu', desc:'SONDT Furniture được thành lập với sứ mệnh mang nội thất cao cấp, bền vững đến mọi gia đình Việt.' },
  { year:'2021', title:'Mở Rộng', desc:'Khai trương showroom đầu tiên tại Hà Nội. Ra mắt bộ sưu tập SIGNATURE độc quyền.' },
  { year:'2023', title:'Đột Phá', desc:'Đạt mốc 10.000 khách hàng. Mở rộng hệ thống 5 showroom trên toàn quốc.' },
  { year:'2026', title:'Hiện Tại', desc:'Top 10 thương hiệu nội thất uy tín. Phục vụ hơn 50.000 gia đình Việt.' },
];
const values = [
  { icon:'🎨', title:'Thiết Kế Tinh Tế', desc:'Mỗi sản phẩm là một tác phẩm nghệ thuật, kết hợp thẩm mỹ và công năng.' },
  { icon:'🌿', title:'Bền Vững', desc:'Sử dụng gỗ từ rừng trồng có chứng nhận FSC, thân thiện với môi trường.' },
  { icon:'⚡', title:'Chất Lượng Quốc Tế', desc:'Quy trình sản xuất đạt chuẩn ISO, đảm bảo độ bền vượt thời gian.' },
  { icon:'💛', title:'Tận Tâm', desc:'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7 và bảo hành lên đến 5 năm.' },
];
const stats = [
  { num:'50,000+', label:'Khách hàng' },
  { num:'5,000+', label:'Sản phẩm' },
  { num:'8', label:'Showroom' },
  { num:'5 năm', label:'Bảo hành' },
];
const team = [
  { name:'Trần Duy Sơn', role:'Founder & CEO', desc:'Người sáng lập với hơn 10 năm kinh nghiệm trong ngành nội thất cao cấp.' },
  { name:'Nguyễn Minh Anh', role:'Giám đốc Thiết kế', desc:'Kiến trúc sư tài năng, tốt nghiệp từ trường ĐH Kiến Trúc Hà Nội.' },
  { name:'Phạm Hoàng Long', role:'Giám đốc Vận hành', desc:'Chuyên gia quản lý chuỗi cung ứng với kinh nghiệm 8 năm.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* HERO */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#2d2118 40%,#1a1a1a 100%)'}}>
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber-700/10 blur-[100px]"/>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-900/8 blur-[120px]"/>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#d4a843]"/><span className="text-[#d4a843] text-xs font-semibold uppercase tracking-[0.25em]">Since 2020</span><div className="w-8 h-[1px] bg-[#d4a843]"/>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">Kiến Tạo Không Gian<br/><span style={{color:'#d4a843'}}>Đẳng Cấp</span></h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">SONDT Furniture — Nơi nghệ thuật gặp cuộc sống. Chúng tôi tin rằng mỗi ngôi nhà xứng đáng được kiến tạo bởi những sản phẩm tốt nhất.</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1a1a1a] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s,i)=>(<div key={i} className="py-8 md:py-10 text-center"><div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.num}</div><div className="text-gray-500 text-xs uppercase tracking-widest">{s.label}</div></div>))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Câu chuyện</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Từ Đam Mê Đến <span style={{color:'#b8860b'}}>Thương Hiệu</span></h2>
              <p className="text-gray-500 text-base leading-relaxed mb-4">SONDT Furniture khởi nguồn từ niềm đam mê với gỗ tự nhiên và thiết kế tối giản. Chúng tôi tin rằng nội thất không chỉ là đồ vật — mà là linh hồn của ngôi nhà.</p>
              <p className="text-gray-500 text-base leading-relaxed mb-6">Mỗi sản phẩm SONDT đều được chế tác tỉ mỉ từ những chất liệu tốt nhất, kết hợp giữa nghệ thuật truyền thống Việt Nam và thiết kế đương đại quốc tế.</p>
              <Link href="/products" className="inline-flex items-center gap-2 text-[#b8860b] font-semibold text-sm uppercase tracking-widest hover:gap-3 transition-all border-b border-[#b8860b]/30 pb-1">Khám phá sản phẩm <span>&rarr;</span></Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-sm overflow-hidden">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80" alt="SONDT Workshop" className="w-full h-full object-cover"/>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-sm border border-gray-100 max-w-[200px]">
                <div className="text-3xl font-extrabold text-[#b8860b] mb-1">6+</div>
                <div className="text-sm text-gray-600 font-medium">Năm kinh nghiệm trong ngành nội thất</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Giá trị cốt lõi</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Tại Sao Chọn <span style={{color:'#b8860b'}}>SONDT</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v,i)=>(<div key={i} className="text-center p-8 bg-white rounded-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"><div className="text-4xl mb-4">{v.icon}</div><h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3><p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p></div>))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Hành trình</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Cột Mốc <span style={{color:'#b8860b'}}>Phát Triển</span></h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((t,i)=>(
              <div key={i} className="flex gap-6 mb-10 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a843] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">{t.year}</div>
                  {i<timeline.length-1&&<div className="w-[2px] flex-1 bg-gradient-to-b from-[#d4a843]/40 to-transparent mt-2"/>}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20" style={{background:'#f9f6f2'}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#b8860b]"/><span className="text-[#b8860b] text-xs font-semibold uppercase tracking-[0.25em]">Đội ngũ</span><div className="w-8 h-[1px] bg-[#b8860b]"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Những Người <span style={{color:'#b8860b'}}>Kiến Tạo</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((m,i)=>(
              <div key={i} className="text-center p-8 bg-white rounded-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b8860b]/20 to-[#d4a843]/10 mx-auto mb-5 flex items-center justify-center text-[#b8860b] text-2xl font-extrabold">{m.name.charAt(0)}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{m.name}</h3>
                <p className="text-[#b8860b] text-xs font-semibold uppercase tracking-wider mb-3">{m.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#2d2118 50%,#1a1a1a 100%)'}}>
        <div className="absolute inset-0 animate-shimmer"/>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">Sẵn Sàng Kiến Tạo <span style={{color:'#d4a843'}}>Ngôi Nhà Mơ Ước</span>?</h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto mb-8">Liên hệ với đội ngũ tư vấn của chúng tôi để được hỗ trợ miễn phí.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="text-white font-semibold py-3.5 px-10 text-sm uppercase tracking-widest" style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>Xem sản phẩm</Link>
            <a href="tel:0326330991" className="border border-white/25 text-white/80 hover:text-white hover:border-white/60 font-semibold py-3.5 px-10 text-sm uppercase tracking-widest transition-all">Gọi ngay: 0326330991</a>
          </div>
        </div>
      </section>
    </div>
  );
}
