'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_phone: '',
    shipping_address: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    const sessionId = localStorage.getItem('sessionId');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(!token && sessionId && { 'x-session-id': sessionId }),
    };
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/cart`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setCartData(data.data);
      }
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    // Load user info
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setFormData(prev => ({
          ...prev,
          recipient_name: u.full_name || '',
          recipient_phone: u.phone || '',
        }));
      } catch (e) {}
    }
    fetchCart();
  }, [fetchCart]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch(`${apiUrl}/api/cart/update-quantity`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) setCartData(data.data);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await fetch(`${apiUrl}/api/cart/remove`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cart_item_id: cartItemId }),
      });
      const data = await res.json();
      if (data.success) setCartData(data.data);
    } catch (error) {
      console.error('Lỗi xóa:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await fetch(`${apiUrl}/api/cart/apply-coupon`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ coupon_code: couponCode.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCartData(data.data);
        showToast('success', 'Áp dụng mã giảm giá thành công!');
      } else {
        showToast('error', data.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      showToast('error', 'Không thể kết nối server');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const handlePlaceOrder = async () => {
    // Validate
    if (!formData.recipient_name.trim()) {
      showToast('error', 'Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.recipient_phone.trim()) {
      showToast('error', 'Vui lòng nhập số điện thoại');
      return;
    }
    if (!formData.shipping_address.trim()) {
      showToast('error', 'Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    if (!items || items.length === 0) {
      showToast('error', 'Giỏ hàng trống');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const orderPayload = {
        recipient_name: formData.recipient_name.trim(),
        recipient_phone: formData.recipient_phone.trim(),
        shipping_address: formData.shipping_address.trim(),
        payment_method: paymentMethod,
        note: formData.note.trim(),
      };

      // If guest (no token), include items in body
      if (!token) {
        orderPayload.items = items.map(item => ({
          variant_id: item.variant_id,
          name: item.name,
          sku: item.sku,
          base_price: item.base_price,
          unit_price: item.unit_price,
          quantity: item.quantity,
          image_url: item.image_url,
          discount_pct: 0,
        }));
      }

      const res = await fetch(`${apiUrl}/api/orders/checkout`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đặt hàng thành công!');
        // Clear sessionId for guest
        if (!token) localStorage.removeItem('sessionId');
        setTimeout(() => {
          window.location.href = token ? '/orders' : '/';
        }, 2000);
      } else {
        showToast('error', data.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      showToast('error', 'Không thể kết nối đến server');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';
  };

  const items = cartData?.items || [];
  const totals = cartData?.totals || {};

  // Loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-8"></div>
            <div className="flex gap-8">
              <div className="flex-1 space-y-6">
                <div className="h-48 bg-white rounded-lg"></div>
                <div className="h-64 bg-white rounded-lg"></div>
              </div>
              <div className="w-80 h-80 bg-white rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'bank_transfer',
      label: 'Thanh toán chuyển khoản qua ngân hàng',
      icon: '🏦',
      details: (
        <div className="ml-9 mt-2 text-xs text-gray-600 space-y-0.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p><span className="text-gray-500">Tên tài khoản:</span> <strong>Công Ty SONDT Furniture</strong></p>
          <p><span className="text-gray-500">Số tài khoản:</span> <strong>0071001303667</strong></p>
          <p><span className="text-gray-500">Ngân hàng:</span> <strong>Vietcombank – CN HCM</strong></p>
          <p><span className="text-gray-500">Nội dung:</span> <strong>Tên + SĐT đặt hàng</strong></p>
        </div>
      ),
    },
    {
      id: 'cod',
      label: 'Thanh toán quẹt thẻ khi giao hàng (POS)',
      icon: '💳',
    },
    {
      id: 'vnpay',
      label: 'Thanh toán online qua cổng VNPay (ATM/Visa/MasterCard/JCB/QR Pay trên Internet Banking)',
      icon: '🌐',
      badges: ['VISA', 'JCB', 'MC'],
    },
    {
      id: 'momo',
      label: 'Thanh toán online qua ví MoMo',
      icon: '📱',
    },
    {
      id: 'qr_vcb',
      label: 'Chuyển khoản qua QR - VCB',
      icon: '📲',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6">

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="flex-1 space-y-5">

            {/* 1. Account Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Tài khoản</h2>
                {user && (
                  <button onClick={handleLogout} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                    Đăng xuất
                  </button>
                )}
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Khách vãng lai</p>
                    <Link href="/login" className="text-blue-600 text-xs hover:underline">Đăng nhập để theo dõi đơn hàng</Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Shipping Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nhập số điện thoại</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="recipient_phone"
                      value={formData.recipient_phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">🇻🇳</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quốc gia</label>
                  <input
                    type="text"
                    value="Vietnam"
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Địa chỉ, tên đường</label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* 3. Shipping Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">Phương thức giao hàng</h2>
              <div className="text-sm text-gray-500 italic bg-gray-50 rounded-lg px-4 py-3 border border-dashed border-gray-200">
                {formData.shipping_address
                  ? '✅ Giao hàng tiêu chuẩn — Miễn phí'
                  : 'Nhập địa chỉ để xem các phương thức giao hàng'}
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div key={method.id}>
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{method.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{method.label}</span>
                        </div>
                        {method.badges && paymentMethod === method.id && (
                          <div className="flex gap-1.5 mt-2 ml-6">
                            {method.badges.map(b => (
                              <span key={b} className="px-2 py-0.5 bg-gray-100 text-xs font-bold rounded text-gray-600 border border-gray-200">{b}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                    {paymentMethod === method.id && method.details && method.details}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Order Note */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Ghi chú đơn hàng"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none placeholder-gray-400"
                rows={3}
              />
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="lg:w-[380px] flex-shrink-0 space-y-5">

            {/* Cart Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-4">
              <h2 className="text-base font-bold text-gray-900 mb-4">Giỏ hàng</h2>

              {items.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-6 text-center">Giỏ hàng trống</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.cart_item_id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      {/* Image */}
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Ảnh</div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</h4>
                          <button
                            onClick={() => handleRemoveItem(item.cart_item_id)}
                            className="text-gray-300 hover:text-red-500 transition flex-shrink-0 mt-0.5"
                            title="Xóa"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {item.sku && <p className="text-xs text-gray-400 mt-0.5">{item.sku}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-red-600">{formatPrice(item.unit_price)}</span>
                          {/* Qty controls */}
                          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 text-xs"
                            >−</button>
                            <span className="w-8 h-7 flex items-center justify-center text-xs font-bold text-gray-900 border-x border-gray-300">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition text-xs"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">Mã khuyến mãi</h2>
              {totals.p_coupon_code && (
                <div className="mb-3 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium border border-green-200">
                  <span>✨</span>
                  <span>Đang áp dụng: <strong>{totals.p_coupon_code}</strong></span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã khuyến mãi"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
                >
                  {applyingCoupon ? '...' : 'Áp dụng'}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span className="font-medium text-gray-900">{formatPrice(totals.p_subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium text-gray-500">-</span>
                </div>
                {totals.p_discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-medium text-green-600">-{formatPrice(totals.p_discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-lg font-bold text-red-600">{formatPrice(totals.p_total || totals.p_subtotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || items.length === 0}
                className="w-full mt-5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-lg transition-all duration-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {toast.type === 'success' ? '✅' : '❌'}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
