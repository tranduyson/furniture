'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        // Lưu token vào localStorage
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Chuyển hướng theo role
        if (data.data.user.role === 'admin') {
          window.location.href = '/admin'; // Force full reload to load admin layout cleanly
        } else {
          window.location.href = '/'; // Force full reload for user
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[35%] relative items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2d2118 40%,#1a1a1a 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber-700/10 blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-900/8 blur-[120px]" />
        <div className="relative z-10 max-w-md px-10">
          <Link href="/" className="inline-block mb-10">
            <div className="text-4xl font-extrabold text-white">SONDT<span className="text-[#d4a843]">.</span></div>
          </Link>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">Chào mừng bạn<br />trở lại</h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">Đăng nhập để khám phá bộ sưu tập nội thất cao cấp và quản lý đơn hàng của bạn.</p>
          <div className="space-y-4">
            {[
              { icon: '🛡️', text: 'Bảo mật tuyệt đối với mã hóa SSL' },
              { icon: '🚚', text: 'Theo dõi đơn hàng realtime' },
              { icon: '💛', text: 'Ưu đãi độc quyền cho thành viên' },
            ].map((item, i) => (
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
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-extrabold text-gray-900">SONDT<span className="text-[#d4a843]">.</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-500 text-sm mb-8">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-[#b8860b] font-semibold hover:text-[#d4a843] transition">
              Đăng ký miễn phí
            </Link>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-sm text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b]/30 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                </div>
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  value={formData.password} onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="block w-full pl-11 pr-12 py-3 border border-gray-300 rounded-sm text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b]/30 transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#b8860b] focus:ring-[#b8860b]/30" />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm text-[#b8860b] font-semibold hover:text-[#d4a843] transition">Quên mật khẩu?</a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 text-white font-semibold text-sm uppercase tracking-widest transition-all duration-500 rounded-sm ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]'}`}
              style={{ background: 'linear-gradient(135deg,#b8860b,#d4a843)' }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Đang đăng nhập...</>
              ) : 'Đăng nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-white text-xs text-gray-400 uppercase tracking-wider">Hoặc tiếp tục với</span></div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <a href="#" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google
            </a>
            <a href="#" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
