'use client';

import AdminLayout from '../../../../components/admin/AdminLayout';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
});

export default function AdminProductDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attrTypes, setAttrTypes] = useState([]);
  const [attrValues, setAttrValues] = useState([]);
  const [toast, setToast] = useState(null);

  // Variant form
  const [variantModal, setVariantModal] = useState(null);
  const [variantForm, setVariantForm] = useState({ sku: '', price_override: '', stock_qty: 0, is_active: 1, attribute_value_ids: [] });

  // Attribute value form
  const [avModal, setAvModal] = useState(false);
  const [avForm, setAvForm] = useState({ type_id: '', value: '', color_hex: '', display_order: 0 });

  // New attribute type
  const [newTypeName, setNewTypeName] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/products/${id}`, { headers: headers() });
      const d = await res.json();
      if (d.success) setProduct(d.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [id]);

  const fetchAttrTypes = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/attribute-types`, { headers: headers() });
      const d = await res.json();
      if (d.success) setAttrTypes(d.data || []);
    } catch (e) { console.error(e); }
  }, []);

  const fetchAttrValues = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/attribute-values`, { headers: headers() });
      const d = await res.json();
      if (d.success) setAttrValues(d.data || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchProduct(); fetchAttrTypes(); fetchAttrValues(); }, [fetchProduct, fetchAttrTypes, fetchAttrValues]);

  // ---- Attribute Type CRUD ----
  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;
    await fetch(`${API}/api/admin/attribute-types`, { method: 'POST', headers: headers(), body: JSON.stringify({ name: newTypeName }) });
    setNewTypeName('');
    fetchAttrTypes();
    showToast('Đã thêm loại thuộc tính');
  };

  const handleDeleteType = async (typeId) => {
    if (!confirm('Xóa loại thuộc tính này? Tất cả giá trị liên quan sẽ bị xóa.')) return;
    await fetch(`${API}/api/admin/attribute-types/${typeId}`, { method: 'DELETE', headers: headers() });
    fetchAttrTypes();
    fetchAttrValues();
    showToast('Đã xóa loại thuộc tính');
  };

  // ---- Attribute Value CRUD ----
  const handleCreateAttrValue = async () => {
    if (!avForm.type_id || !avForm.value.trim()) return;
    await fetch(`${API}/api/admin/attribute-values`, { method: 'POST', headers: headers(), body: JSON.stringify(avForm) });
    setAvModal(false);
    setAvForm({ type_id: '', value: '', color_hex: '', display_order: 0 });
    fetchAttrValues();
    showToast('Đã thêm giá trị thuộc tính');
  };

  const handleDeleteAttrValue = async (avId) => {
    if (!confirm('Xóa giá trị thuộc tính này?')) return;
    await fetch(`${API}/api/admin/attribute-values/${avId}`, { method: 'DELETE', headers: headers() });
    fetchAttrValues();
    showToast('Đã xóa giá trị thuộc tính');
  };

  // ---- Variant CRUD ----
  const openCreateVariant = () => {
    setVariantForm({ sku: '', price_override: '', stock_qty: 0, is_active: 1, attribute_value_ids: [] });
    setVariantModal('create');
  };

  const openEditVariant = (v) => {
    setVariantForm({
      id: v.id,
      sku: v.sku,
      price_override: v.price_override || '',
      stock_qty: v.stock_qty,
      is_active: v.is_active,
      attribute_value_ids: (v.attribute_values || []).map(a => a.attr_value_id)
    });
    setVariantModal('edit');
  };

  const handleSaveVariant = async () => {
    const payload = { ...variantForm, price_override: variantForm.price_override || null, stock_qty: parseInt(variantForm.stock_qty) || 0 };
    if (variantModal === 'create') {
      await fetch(`${API}/api/admin/products/${id}/variants`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
      showToast('Đã thêm biến thể');
    } else {
      await fetch(`${API}/api/admin/variants/${variantForm.id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(payload) });
      showToast('Đã cập nhật biến thể');
    }
    setVariantModal(null);
    fetchProduct();
  };

  const handleDeleteVariant = async (vId) => {
    if (!confirm('Xóa biến thể này?')) return;
    await fetch(`${API}/api/admin/variants/${vId}`, { method: 'DELETE', headers: headers() });
    fetchProduct();
    showToast('Đã xóa biến thể');
  };

  const toggleAttrValue = (avId) => {
    setVariantForm(prev => ({
      ...prev,
      attribute_value_ids: prev.attribute_value_ids.includes(avId)
        ? prev.attribute_value_ids.filter(x => x !== avId)
        : [...prev.attribute_value_ids, avId]
    }));
  };

  // Group attribute values by type
  const groupedAttrValues = attrValues.reduce((acc, av) => {
    const key = av.type_name || 'Khác';
    if (!acc[key]) acc[key] = { type_id: av.type_id, values: [] };
    acc[key].values.push(av);
    return acc;
  }, {});

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div></div></AdminLayout>;
  if (!product) return <AdminLayout><div className="text-center py-20 text-gray-500">Không tìm thấy sản phẩm</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/products" className="text-sm text-amber-600 hover:underline mb-2 inline-block">← Quay lại danh sách</Link>
            <h1 className="text-2xl font-black text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {product.id} • SKU: {product.sku_base}</p>
          </div>
        </div>

        {/* ===== SECTION: Quản lý thuộc tính ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">⚙</span>
              Quản Lý Thuộc Tính (Attribute Types & Values)
            </h2>
            <p className="text-xs text-gray-500 mt-1">Tạo các loại thuộc tính (Kích thước, Màu sắc...) và giá trị tương ứng</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Thêm loại thuộc tính */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Thêm loại thuộc tính mới</label>
                <input value={newTypeName} onChange={e => setNewTypeName(e.target.value)} placeholder="VD: Kích thước, Màu sắc, Chất liệu..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleCreateType()} />
              </div>
              <button onClick={handleCreateType} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition whitespace-nowrap">
                ＋ Thêm
              </button>
            </div>

            {/* Danh sách thuộc tính + giá trị */}
            {attrTypes.map(type => (
              <div key={type.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-sm">{type.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => { setAvForm({ type_id: type.id, value: '', color_hex: '', display_order: 0 }); setAvModal(true); }}
                      className="text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg text-xs font-bold transition">＋ Thêm giá trị</button>
                    <button onClick={() => handleDeleteType(type.id)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-bold transition">Xóa</button>
                  </div>
                </div>
                <div className="px-5 py-3">
                  {(groupedAttrValues[type.name]?.values || []).length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Chưa có giá trị nào</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(groupedAttrValues[type.name]?.values || []).map(av => (
                        <span key={av.id} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm group hover:border-purple-300 transition">
                          {av.color_hex && <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: av.color_hex }}></span>}
                          <span className="font-medium text-gray-700">{av.value}</span>
                          <button onClick={() => handleDeleteAttrValue(av.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-xs">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION: Quản lý Variants ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm">🔀</span>
                Biến Thể Sản Phẩm (Variants)
              </h2>
              <p className="text-xs text-gray-500 mt-1">Mỗi biến thể có SKU, giá, tồn kho riêng và được gán các giá trị thuộc tính</p>
            </div>
            <button onClick={openCreateVariant} className="bg-amber-500 text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition">
              ＋ Thêm biến thể
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {(!product.variants || product.variants.length === 0) ? (
              <div className="px-6 py-12 text-center text-gray-400">
                <p className="text-lg mb-2">Chưa có biến thể nào</p>
                <p className="text-sm">Nhấn "Thêm biến thể" để tạo biến thể đầu tiên</p>
              </div>
            ) : product.variants.map(v => (
              <div key={v.id} className="px-6 py-5 hover:bg-gray-50/50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-gray-900 text-sm bg-gray-100 px-3 py-1 rounded-lg">{v.sku}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${v.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {v.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>Giá: <strong className="text-gray-900">{v.price_override ? `${fmt(v.price_override)}₫` : 'Theo sản phẩm gốc'}</strong></span>
                      <span>Tồn kho: <strong className="text-gray-900">{v.stock_qty}</strong></span>
                    </div>
                    {/* Thuộc tính của variant */}
                    {v.attribute_values && v.attribute_values.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {v.attribute_values.map(attr => (
                          <span key={attr.attr_value_id} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 text-xs font-semibold text-blue-700">
                            {attr.color_hex && <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: attr.color_hex }}></span>}
                            <span className="text-blue-500">{attr.type_name}:</span> {attr.value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Chưa gán thuộc tính</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEditVariant(v)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sửa</button>
                    <button onClick={() => handleDeleteVariant(v.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODAL: Thêm giá trị thuộc tính ===== */}
      {avModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAvModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Thêm giá trị thuộc tính</h3>
              <button onClick={() => setAvModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Loại thuộc tính</label>
                <select value={avForm.type_id} onChange={e => setAvForm({ ...avForm, type_id: parseInt(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none">
                  <option value="">-- Chọn --</option>
                  {attrTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Giá trị</label>
                <input value={avForm.value} onChange={e => setAvForm({ ...avForm, value: e.target.value })} placeholder="VD: 140 x 200 cm, Đỏ, Gỗ sồi..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mã màu (tuỳ chọn)</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={avForm.color_hex || '#000000'} onChange={e => setAvForm({ ...avForm, color_hex: e.target.value })} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                    <input value={avForm.color_hex || ''} onChange={e => setAvForm({ ...avForm, color_hex: e.target.value })} placeholder="#FF5733"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Thứ tự hiển thị</label>
                  <input type="number" value={avForm.display_order} onChange={e => setAvForm({ ...avForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
                </div>
              </div>
              <button onClick={handleCreateAttrValue} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition">
                Thêm giá trị
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Thêm/Sửa Variant ===== */}
      {variantModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setVariantModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">{variantModal === 'create' ? 'Thêm biến thể mới' : 'Sửa biến thể'}</h3>
              <button onClick={() => setVariantModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">SKU</label>
                <input value={variantForm.sku} onChange={e => setVariantForm({ ...variantForm, sku: e.target.value })} placeholder="VD: PROD-001-RED-M"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Giá riêng (₫) - để trống = theo giá gốc</label>
                  <input type="number" value={variantForm.price_override} onChange={e => setVariantForm({ ...variantForm, price_override: e.target.value })} placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tồn kho</label>
                  <input type="number" value={variantForm.stock_qty} onChange={e => setVariantForm({ ...variantForm, stock_qty: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!variantForm.is_active} onChange={e => setVariantForm({ ...variantForm, is_active: e.target.checked ? 1 : 0 })} className="w-4 h-4 accent-amber-500" />
                Kích hoạt biến thể
              </label>

              {/* Gán thuộc tính cho variant */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase">Gán thuộc tính cho biến thể</label>
                {Object.entries(groupedAttrValues).map(([typeName, group]) => (
                  <div key={typeName} className="mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">{typeName}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map(av => {
                        const isSelected = variantForm.attribute_value_ids.includes(av.id);
                        return (
                          <button key={av.id} onClick={() => toggleAttrValue(av.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition
                              ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            {av.color_hex && <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: av.color_hex }}></span>}
                            {av.value}
                            {isSelected && <span className="text-amber-600">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {Object.keys(groupedAttrValues).length === 0 && (
                  <p className="text-gray-400 text-sm italic">Chưa có thuộc tính nào. Hãy tạo thuộc tính ở phần trên.</p>
                )}
              </div>

              <button onClick={handleSaveVariant} className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition">
                {variantModal === 'create' ? 'Tạo biến thể' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`px-6 py-3 rounded-xl shadow-2xl text-white font-bold text-sm ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.msg}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
