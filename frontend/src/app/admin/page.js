'use client';

import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-md transition`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${API}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard icon="📦" label="Tổng đơn hàng" value={fmt(stats?.total_orders)} sub={`${stats?.pending_orders || 0} chờ duyệt`} color="bg-blue-50" />
          <StatCard icon="💰" label="Doanh thu" value={`${fmt(stats?.total_revenue)}₫`} color="bg-green-50" />
          <StatCard icon="👥" label="Khách hàng" value={fmt(stats?.total_users)} color="bg-purple-50" />
          <StatCard icon="🪑" label="Sản phẩm" value={fmt(stats?.total_products)} color="bg-amber-50" />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Đơn hàng gần đây</h2>
            <a href="/admin/orders" className="text-sm text-amber-600 font-semibold hover:underline">Xem tất cả →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">Mã đơn</th>
                  <th className="text-left px-6 py-3">Khách hàng</th>
                  <th className="text-right px-6 py-3">Giá trị</th>
                  <th className="text-center px-6 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(stats?.recent_orders || []).map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-700">{o.order_code}</td>
                    <td className="px-6 py-4 text-gray-900">{o.recipient_name}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{fmt(o.total_amount)}₫</td>
                    <td className="px-6 py-4 text-center">{statusBadge(o.status)}</td>
                  </tr>
                ))}
                {(!stats?.recent_orders?.length) && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Chưa có đơn hàng nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
