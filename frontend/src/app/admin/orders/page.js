'use client';

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState, useMemo } from 'react';
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
  const label = { pending: 'Chờ duyệt', confirmed: 'Đã xác nhận', shipping: 'Vận chuyển', delivered: 'Hoàn thành', cancelled: 'Đã hủy' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[s] || 'bg-gray-100 text-gray-600'}`}>{label[s] || s}</span>;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  // Fetch orders when page, search, or filter changes
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const params = new URLSearchParams({ page, limit, search, status: statusFilter });
        const res = await fetch(`${API}/api/admin/orders?${params}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const d = await res.json();
        if (d.success) { 
          setOrders(d.data); 
          setTotal(d.total); 
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchOrders();
  }, [page, search, statusFilter, limit]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 flex-1">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, tên khách..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Vận chuyển</option>
            <option value="delivered">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Danh sách đơn hàng <span className="text-gray-400 font-normal text-sm">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">Mã đơn</th>
                  <th className="text-left px-6 py-3">Khách hàng</th>
                  <th className="text-left px-6 py-3">Thanh toán</th>
                  <th className="text-right px-6 py-3">Tổng tiền</th>
                  <th className="text-center px-6 py-3">Trạng thái</th>
                  <th className="text-center px-6 py-3">Ngày đặt</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"></div></td></tr>
                  ))
                ) : orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-700 text-xs">{o.order_code}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{o.recipient_name}</p>
                      <p className="text-gray-400 text-xs">{o.recipient_phone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 uppercase text-xs">{o.payment_method}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{fmt(o.total_amount)}₫</td>
                    <td className="px-6 py-4 text-center">{statusBadge(o.order_status)}</td>
                    <td className="px-6 py-4 text-center text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/admin/orders/${o.id}`} className="text-amber-600 hover:underline text-xs font-bold">Chi tiết</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Trang {page}/{totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">◀</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">▶</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
