'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function OrderDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${apiUrl}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Order detail:', data);
        setOrder(data.data);
      } else {
        console.error('Error loading order:', res.status);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-cyan-100 text-cyan-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'shipped': 'Đã gửi',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bạn chưa đăng nhập</h2>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem chi tiết đơn hàng</p>
        <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h2>
        <Link href="/orders" className="inline-block text-blue-600 hover:underline">
          Quay lại lịch sử đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-blue-600 transition">Đơn hàng của tôi</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Đơn hàng #{order.order_code || order.id}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đơn hàng #{order.order_code || order.id}
          </h1>
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getStatusBadgeColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        <Link href="/orders" className="text-blue-600 hover:underline font-medium">
          ← Quay lại
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Chi Tiết Sản Phẩm</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.primary_image ? (
                      <img src={item.primary_image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{item.product_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Số lượng: <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Đơn giá: <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </span>
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Thông Tin Vận Chuyển</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Người nhận</p>
                  <p className="text-sm font-medium text-gray-900">{order.recipient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-900">{order.recipient_phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase mb-1">Địa chỉ giao hàng</p>
                <p className="text-sm font-medium text-gray-900">{order.shipping_address}</p>
              </div>
              {order.note && (
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Ghi chú</p>
                  <p className="text-sm text-gray-900">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 mb-4">Tóm Tắt Đơn Hàng</h2>
            
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">Tổng sản phẩm:</span>
              <span className="font-medium text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  order.total_amount - (order.discount_amount || 0) - (order.shipping_cost || 0)
                )}
              </span>
            </div>

            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-600">Giảm giá:</span>
                <span className="font-medium text-red-600">
                  -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount_amount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-medium text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shipping_cost || 0)}
              </span>
            </div>

            <div className="flex justify-between text-lg py-3 border-t-2 border-gray-200">
              <span className="font-bold text-gray-900">Tổng tiền:</span>
              <span className="font-black text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Phương Thức Thanh Toán</h2>
            <p className="text-sm text-gray-600">
              {order.payment_method === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
              {order.payment_method === 'bank_transfer' && 'Chuyển khoản ngân hàng'}
              {order.payment_method === 'vnpay' && 'VNPAY'}
              {order.payment_method === 'momo' && 'Momo'}
            </p>
          </div>

          {/* Order Date */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Ngày Đặt Hàng</h2>
            <p className="text-sm text-gray-900">
              {new Date(order.created_at).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
