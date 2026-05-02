'use client';

import AdminLayout from '../../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

const statusBadge = (s) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipping: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const label = {
    pending: 'Chờ duyệt',
    confirmed: 'Đã xác nhận',
    shipping: 'Vận chuyển',
    delivered: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  return <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${map[s] || 'bg-gray-100 text-gray-600'}`}>{label[s] || s}</span>;
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API}/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          setError('Không thể tải thông tin đơn hàng');
        }
      } catch (err) {
        setError('Lỗi kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      void fetchOrder();
    }
  }, [orderId]);

  const updateStatus = async (newStatus) => {
    if (!order || updatingStatus) return;
    
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API}/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOrder({ ...order, status: newStatus });
      } else {
        alert('Cập nhật trạng thái thất bại');
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">←</Link>
              <h1 className="text-3xl font-bold text-gray-900">Đơn #{order.order_code}</h1>
            </div>
            <p className="text-gray-500">
              {new Date(order.created_at).toLocaleString('vi-VN')}
            </p>
          </div>
          <div>{statusBadge(order.status)}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tên người nhận</p>
                  <p className="text-base font-semibold text-gray-900">{order.recipient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-base font-semibold text-gray-900">{order.recipient_phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</p>
                  <p className="text-base font-semibold text-gray-900">{order.shipping_address}</p>
                </div>
                {order.note && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                    <p className="text-base text-gray-700 italic">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Sản phẩm</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex gap-4 mb-3">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                        {item.variant_sku && (
                          <p className="text-xs text-gray-500 mb-2">SKU: {item.variant_sku}</p>
                        )}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Đơn giá</p>
                            <p className="font-semibold text-gray-900">{fmt(item.unit_price)}₫</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Số lượng</p>
                            <p className="font-semibold text-gray-900">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Thành tiền</p>
                            <p className="font-bold text-blue-600">{fmt(item.unit_price * item.quantity)}₫</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phương thức</span>
                    <span className="font-semibold text-gray-900 uppercase">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái TT</span>
                    <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Vận chuyển</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái</span>
                    <span className="font-semibold text-gray-900">{statusBadge(order.status)}</span>
                  </div>
                  {order.tracking_number && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mã vận chuyển</span>
                      <span className="font-mono font-semibold text-gray-900">{order.tracking_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng sản phẩm</span>
                  <span className="font-semibold text-gray-900">
                    {(order.items || []).reduce((sum, item) => sum + item.quantity, 0)} cái
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span className="font-semibold text-gray-900">
                    {fmt((order.items || []).reduce((sum, item) => sum + item.unit_price * item.quantity, 0))}₫
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-semibold text-gray-900">
                    {fmt(order.shipping_fee || 0)}₫
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-blue-600 text-lg">{fmt(order.total_amount)}₫</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Cập nhật trạng thái</h3>
              <div className="space-y-2">
                {['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'].map(status => (
                  <button
                    key={status}
                    disabled={order.status === status || updatingStatus}
                    onClick={() => updateStatus(status)}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-bold border transition
                      ${
                        order.status === status
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {{
                      pending: 'Chờ duyệt',
                      confirmed: 'Xác nhận',
                      shipping: 'Vận chuyển',
                      delivered: 'Hoàn thành',
                      cancelled: 'Hủy đơn'
                    }[status]}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Hành động</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                  📧 Gửi email
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                  🖨️ In hóa đơn
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 transition">
                  ❌ Xóa đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
