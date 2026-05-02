'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // cart_item_id being updated
  const [orderNote, setOrderNote] = useState('');
  const [toast, setToast] = useState(null);
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
    setTimeout(() => setToast(null), 3000);
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
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(cartItemId);
    try {
      const res = await fetch(`${apiUrl}/api/cart/update-quantity`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCartData(data.data);
      } else {
        showToast('error', data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      showToast('error', 'Không thể kết nối đến server');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setUpdating(cartItemId);
    try {
      const res = await fetch(`${apiUrl}/api/cart/remove`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cart_item_id: cartItemId }),
      });
      const data = await res.json();
      if (data.success) {
        setCartData(data.data);
        showToast('success', 'Đã xóa sản phẩm khỏi giỏ hàng');
      }
    } catch (error) {
      showToast('error', 'Không thể kết nối đến server');
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const items = cartData?.items || [];
  const totals = cartData?.totals || {};

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-10"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
            <div className="h-1 bg-gray-200 rounded w-12 mx-auto mb-12"></div>
            <div className="flex gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-32 bg-gray-100 rounded"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
              </div>
              <div className="w-80 h-64 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="text-blue-600 hover:text-blue-700 transition font-medium">Trang chủ</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">Giỏ hàng ({items.length})</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Giỏ hàng của bạn</h1>
          <div className="w-12 h-1 bg-gray-900 mx-auto rounded-full"></div>
        </div>

        {/* Empty cart */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg mb-6">Giỏ hàng của bạn đang trống</p>
            <Link href="/products" className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT: Cart Items */}
            <div className="flex-1">
              {/* Item count */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Có <span className="text-red-600 font-bold">{items.length} sản phẩm</span> trong giỏ hàng
                </p>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.cart_item_id} className={`py-6 transition-opacity ${updating === item.cart_item_id ? 'opacity-50' : ''}`}>
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link href={`/products/${item.slug}`} className="text-sm font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2">
                              {item.name}
                            </Link>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm font-bold text-red-600">
                                {formatPrice(item.unit_price)}
                              </span>
                              {item.base_price && item.unit_price < item.base_price && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(item.base_price)}
                                </span>
                              )}
                            </div>
                            {item.sku && (
                              <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
                            )}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveItem(item.cart_item_id)}
                            disabled={updating === item.cart_item_id}
                            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition p-1"
                            title="Xóa sản phẩm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Quantity & Subtotal row */}
                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                              disabled={updating === item.cart_item_id || item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                            >
                              −
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-300 bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                              disabled={updating === item.cart_item_id}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Line subtotal */}
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(item.unit_price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Note */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <label className="block text-sm font-bold text-gray-900 mb-3">Ghi chú đơn hàng</label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Ghi chú thêm cho đơn hàng (ví dụ: giao hàng giờ hành chính, gọi trước khi giao...)"
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition"
                  rows={4}
                />
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:w-[340px] flex-shrink-0">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-28">
                <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Thông tin đơn hàng</h2>

                {/* Subtotal */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tổng tiền:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(totals.p_subtotal || 0)}
                    </span>
                  </div>

                  {totals.p_discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Giảm giá
                        {totals.p_coupon_code && (
                          <span className="text-xs text-blue-600 ml-1">({totals.p_coupon_code})</span>
                        )}
                      </span>
                      <span className="text-sm font-bold text-green-600">-{formatPrice(totals.p_discount)}</span>
                    </div>
                  )}

                  {totals.p_discount > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-sm font-bold text-gray-900">Thành tiền:</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(totals.p_total || 0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-all duration-200 uppercase tracking-wider text-sm shadow-sm hover:shadow-md"
                >
                  Thanh toán
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4 transition"
                >
                  ← Tiếp tục mua hàng
                </Link>

                {/* Shipping Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-xs text-gray-600 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-blue-600 flex-shrink-0 mt-0.5">✔</span>
                    <p>
                      Không mất phí. <strong>Đặt hàng trước, thanh toán sau tại nhà</strong>. Miễn phí giao hàng & lắp đặt tại tất cả quận huyện thuộc TP.HCM, Hà Nội, Khu đô thị Ecopark, Biên Hòa và một số khu vực thuộc Bình Dương (*)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-blue-600 flex-shrink-0 mt-0.5">✔</span>
                    <p>
                      Đơn hàng của quý khách sẽ được <strong>giao hàng trong vòng 3 ngày</strong>, vui lòng đợi nhân viên tư vấn xác nhận lịch giao hàng trước khi thực hiện chuyển khoản cho hàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
