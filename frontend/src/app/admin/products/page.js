'use client';

import AdminLayout from '../../../components/admin/AdminLayout';

import { useEffect, useState, useCallback, useMemo } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);
const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}${path.startsWith('/') ? '' : '/'}${path}`;
};

const emptyForm = { name: '', slug: '', description: '', base_price: '', discount_pct: 0, category_id: '', is_featured: 0, is_active: 1 };

const Field = ({ label, fieldKey, type = 'text', form, onChange, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={3} value={form[fieldKey] || ''} onChange={e => onChange({ ...form, [fieldKey]: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none" {...props} />
    ) : (
      <input type={type} value={form[fieldKey] ?? ''} onChange={e => onChange({ ...form, [fieldKey]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none" {...props} />
    )}
  </div>
);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const limit = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, search });
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`${API}/api/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const d = await res.json();
      console.log('Fetch products response:', d);
      if (d.success && d.data) {
        setProducts(Array.isArray(d.data) ? d.data : []);
        setTotal(d.total || 0);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
    setLoading(false);
  }, [page, limit, search]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`${API}/api/products/categories`);
    const d = await res.json();
    if (d.success) setCategories(d.data || []);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };
    loadProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };
    loadCategories();
  }, [fetchCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const openCreate = () => { setForm(emptyForm); setModal('create'); setUploadedImage(null); setImagePreview(null); };

  const openEdit = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const d = await res.json();
      if (d.success) {
        setForm({ ...d.data });
        setModal('edit');
        setUploadedImage(null);
        const existingImg = d.data.primary_image || d.data.images?.[0]?.image_url || null;
        setImagePreview(imgUrl(existingImg));
      }
    } catch (e) {
      console.error('Error editing product:', e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = modal === 'edit';
      const url = isEdit ? `${API}/api/admin/products/${form.id}` : `${API}/api/admin/products`;
      const method = isEdit ? 'PUT' : 'POST';
      const accessToken = localStorage.getItem('accessToken');

      // If image uploaded, use FormData
      if (uploadedImage) {
        const formData = new FormData();
        Object.keys(form).forEach(key => {
          formData.append(key, form[key] ?? '');
        });
        formData.append('primary_image', uploadedImage);

        const res = await fetch(url, {
          method,
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData
        });
        const d = await res.json();
        console.log('Save response:', d);
      } else {
        // Use JSON if no image
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(form)
        });
        const d = await res.json();
        console.log('Save response:', d);
      }

      setModal(null);
      setUploadedImage(null);
      setImagePreview(null);
      fetchProducts();
    } catch (e) {
      console.error('Error saving product:', e);
    }
    setSaving(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      // Preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const d = await res.json();
      console.log('Delete response:', d);
      fetchProducts();
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex gap-3 flex-1">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <button type="submit" className="bg-amber-500 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition">Tìm</button>
          </form>
          <button onClick={openCreate} className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#2a2a4e] transition flex items-center gap-2">
            ＋ Thêm sản phẩm
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Danh sách sản phẩm <span className="text-gray-400 font-normal text-sm">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">Sản phẩm</th>
                  <th className="text-left px-6 py-3">Danh mục</th>
                  <th className="text-right px-6 py-3">Giá gốc</th>
                  <th className="text-center px-6 py-3">Giảm %</th>
                  <th className="text-center px-6 py-3">Tồn kho</th>
                  <th className="text-center px-6 py-3">Nổi bật</th>
                  <th className="text-center px-6 py-3">Active</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"></div></td></tr>
                  ))
                ) : products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.primary_image ? (
                          <img src={imgUrl(p.primary_image)} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">🪑</div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-gray-400 text-xs">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.category_name || '—'}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{fmt(p.base_price)}₫</td>
                    <td className="px-6 py-4 text-center">
                      {p.discount_pct > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">-{p.discount_pct}%</span>}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900 font-bold">{p.stock_qty}</td>
                    <td className="px-6 py-4 text-center">{p.is_featured ? '⭐' : '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'ON' : 'OFF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => openEdit(p.id)} className="text-blue-600 hover:underline text-xs font-bold">Sửa</button>
                        <a href={`/admin/products/${p.id}`} className="text-purple-600 hover:underline text-xs font-bold">Cấu hình</a>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs font-bold">Xóa</button>
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

      {/* Product Form Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{modal === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Hình ảnh sản phẩm</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 text-sm text-gray-500 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Field label="Tên sản phẩm" fieldKey="name" placeholder="VD: Bộ bàn ăn gỗ sồi..." form={form} onChange={setForm} />
              <Field label="Slug (URL)" fieldKey="slug" placeholder="VD: bo-ban-an-go-soi-001" form={form} onChange={setForm} />
              <Field label="Mô tả" fieldKey="description" type="textarea" placeholder="Mô tả ngắn về sản phẩm..." form={form} onChange={setForm} />

              <div className="grid grid-cols-3 gap-4">
                <Field label="Giá gốc (₫)" fieldKey="base_price" type="number" placeholder="0" form={form} onChange={setForm} />
                <Field label="Giảm giá (%)" fieldKey="discount_pct" type="number" placeholder="0" form={form} onChange={setForm} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Danh mục</label>
                <select value={form.category_id || ''} onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none">
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={!!form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })} className="w-4 h-4 accent-amber-500" />
                  Sản phẩm nổi bật
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={!!form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} className="w-4 h-4 accent-amber-500" />
                  Kích hoạt (hiển thị)
                </label>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition disabled:opacity-50">
                {saving ? 'Đang lưu...' : (modal === 'create' ? 'Tạo sản phẩm' : 'Lưu thay đổi')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
