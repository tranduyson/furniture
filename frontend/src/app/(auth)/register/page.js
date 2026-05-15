'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', password_confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name?.trim()) newErrors.full_name = 'Vui lòng nhập họ tên';
    if (!form.email?.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    if (!form.password?.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) newErrors.password = 'Mật khẩu phải ≥ 6 ký tự';
    if (form.password !== form.password_confirm) newErrors.password_confirm = 'Mật khẩu không khớp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone?.trim() || null, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ server: data.message || 'Đăng ký thất bại' }); return; }
      setSuccessMsg('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (e) { setErrors({ server: 'Lỗi: ' + e.message }); }
    finally { setLoading(false); }
  };

  const InputField = ({ id, label, type = 'text', placeholder, value, onChange, error, icon }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">{icon}</div>
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          className={`block w-full pl-11 pr-4 py-3 border rounded-sm text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b]/30 transition ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-300'}`}/>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01"/></svg>{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[35%] relative items-center justify-center overflow-hidden" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#2d2118 40%,#1a1a1a 100%)'}}>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',backgroundSize:'40px 40px'}}/>
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber-700/10 blur-[100px]"/>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-900/8 blur-[120px]"/>
        <div className="relative z-10 max-w-md px-10">
          <Link href="/" className="inline-block mb-10">
            <div className="text-4xl font-extrabold text-white">SONDT<span className="text-[#d4a843]">.</span></div>
          </Link>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">Gia nhập cộng đồng<br/><span style={{color:'#d4a843'}}>SONDT Furniture</span></h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">Tạo tài khoản để tận hưởng những ưu đãi độc quyền và trải nghiệm mua sắm nội thất cao cấp.</p>
          <div className="space-y-4">
            {[
              {icon:'🎁', text:'Giảm 10% cho đơn hàng đầu tiên'},
              {icon:'📦', text:'Theo dõi đơn hàng & lịch sử mua sắm'},
              {icon:'⭐', text:'Tích điểm đổi quà mỗi lần mua hàng'},
            ].map((item,i)=>(
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-400 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-[65%] flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-32 bg-white">
        <div className="lg:hidden text-center mb-8">
          <Link href="/"><span className="text-3xl font-extrabold text-gray-900">SONDT<span className="text-[#d4a843]">.</span></span></Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Tạo tài khoản</h1>
          <p className="text-gray-500 text-sm mb-8">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-[#b8860b] font-semibold hover:text-[#d4a843] transition">Đăng nhập</Link>
          </p>

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-700 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {successMsg}
            </div>
          )}
          {errors.server && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField id="full_name" label="Họ và Tên" placeholder="Nguyễn Văn A" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} error={errors.full_name}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>}/>

            <InputField id="email" label="Email" type="email" placeholder="example@gmail.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} error={errors.email}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>}/>

            <InputField id="phone" label="Số điện thoại (tuỳ chọn)" type="tel" placeholder="0912345678" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>}/>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </div>
                <input id="password" type={showPassword?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Ít nhất 6 ký tự"
                  className={`block w-full pl-11 pr-12 py-3 border rounded-sm text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b]/30 transition ${errors.password?'border-red-300 bg-red-50/30':'border-gray-300'}`}/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={showPassword?"M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88":"M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"}/>{!showPassword&&<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>}</svg>
                </button>
              </div>
              {errors.password&&<p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <InputField id="password_confirm" label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" value={form.password_confirm} onChange={e=>setForm({...form,password_confirm:e.target.value})} error={errors.password_confirm}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>}/>

            <button type="submit" disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 text-white font-semibold text-sm uppercase tracking-widest transition-all duration-500 rounded-sm mt-2 ${loading?'opacity-60 cursor-not-allowed':'hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]'}`}
              style={{background:'linear-gradient(135deg,#b8860b,#d4a843)'}}>
              {loading?(<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Đang đăng ký...</>):'Đăng Ký Tài Khoản'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-[#b8860b] hover:underline">Điều khoản sử dụng</a> và{' '}
            <a href="#" className="text-[#b8860b] hover:underline">Chính sách bảo mật</a> của SONDT.
          </p>
        </div>
      </div>
    </div>
  );
}
