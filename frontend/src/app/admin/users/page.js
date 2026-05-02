'use client';

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState, useCallback, useMemo } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const params = new URLSearchParams({ page, limit, search });
    const res = await fetch(`${API}/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const d = await res.json();
    if (d.success) { setUsers(d.data); setTotal(d.total); }
    setLoading(false);
  }, [page, limit, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => { 
    e.preventDefault(); 
    setPage(1);
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    setSavingId(editUser.id);
    
    const payload = { 
      full_name: editUser.full_name, 
      email: editUser.email, 
      phone: editUser.phone, 
      role: editUser.role, 
      is_active: editUser.is_active 
    };
    
    if (editUser.password) {
      payload.password = editUser.password;
    }
    
    await fetch(`${API}/api/admin/users/${editUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    setSavingId(null);
    setEditUser(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    const token = localStorage.getItem('accessToken');
    await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
          />
          <button type="submit" className="bg-amber-500 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition">Tìm kiếm</button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Danh sách người dùng <span className="text-gray-400 font-normal text-sm">({total})</span></h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">Họ tên</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">SĐT</th>
                  <th className="text-left px-6 py-3">Mật khẩu</th>
                  <th className="text-center px-6 py-3">Vai trò</th>
                  <th className="text-center px-6 py-3">Đơn hàng</th>
                  <th className="text-center px-6 py-3">Trạng thái</th>
                  <th className="text-center px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={9} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"></div></td></tr>
                  ))
                ) : users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{u.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs break-all">
                      <span title={u.password_hash || '—'} className="cursor-pointer hover:text-gray-900">
                        {u.password_hash ? `${u.password_hash.substring(0, 20)}...` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{u.order_count}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.is_active ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setEditUser({ ...u })} className="text-blue-600 hover:underline text-xs font-bold">Sửa</button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:underline text-xs font-bold">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa người dùng</h3>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Họ tên', key: 'full_name' },
                { label: 'Email', key: 'email' },
                { label: 'Số điện thoại', key: 'phone' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{label}</label>
                  <input
                    type="text" value={editUser[key] || ''}
                    onChange={e => setEditUser({ ...editUser, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mật khẩu mới (để trống nếu không đổi)</label>
                <input
                  type="password" value={editUser.password || ''}
                  onChange={e => setEditUser({ ...editUser, password: e.target.value })}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Vai trò</label>
                  <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none">
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Trạng thái</label>
                  <select value={editUser.is_active} onChange={e => setEditUser({ ...editUser, is_active: parseInt(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none">
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Bị khóa</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSave} disabled={!!savingId}
                className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
              >
                {savingId ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
