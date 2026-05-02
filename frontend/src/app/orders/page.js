'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      console.log('API URL:', apiUrl);
      
      const res = await fetch(`${apiUrl}/api/orders/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Orders data:', data);

      if (res.ok && data.success) {
        const ordersList = Array.isArray(data.data) ? data.data : [];
        console.log('Setting orders:', ordersList);
        setOrders(ordersList);
      } else if (res.status === 401) {
        console.error('Unauthorized - Token expired?');
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else {
        const errorMsg = data.message || res.statusText || 'Không thể tải đơn hàng';
        console.error('Error loading orders:', errorMsg);
        setError(errorMsg);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError(`Lỗi: ${error.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    loadOrders();
  }, [loadOrders]);

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
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn</p>
        <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Đơn Hàng Của Tôi</h1>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Đơn Hàng Của Tôi</h1>
        <button 
          onClick={loadOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          ↻ Làm mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <span className="text-red-600 font-bold text-xl">⚠</span>
          <div>
            <p className="text-red-800 font-semibold">Lỗi tải đơn hàng</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg mb-6">Bạn chưa có đơn hàng nào</p>
          <Link href="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between gap-6">
                {/* Left: Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Đơn hàng #{order.order_code || `#${order.id}`}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusBadgeColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Ngày đặt</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Tổng tiền</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Số sản phẩm</p>
                      <p className="text-sm font-medium text-gray-900">{order.item_count || 0} sản phẩm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Địa chỉ</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.shipping_address}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Người nhận: <span className="font-medium text-gray-900">{order.recipient_name}</span>
                  </p>
                </div>

                {/* Right: Arrow */}
                <div className="hidden sm:flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
