'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const imgUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (e) {
        console.error("Lỗi lấy danh mục:", e);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${apiUrl}/api/products?page=${pagination.page}&limit=${pagination.limit}`;
        if (selectedCategory) {
          url += `&category_id=${selectedCategory}`;
        }
        if (searchKeyword) {
          url += `&search=${encodeURIComponent(searchKeyword)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.products || []);
          setPagination(prev => ({ ...prev, total: data.data.pagination?.total || 0 }));
        }
      } catch (e) {
        console.error("Lỗi lấy sản phẩm:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [pagination.page, selectedCategory, searchKeyword, apiUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800 font-semibold cursor-default">
            Tất cả sản phẩm
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Danh mục</h3>
            <ul className="space-y-3 mb-6">
              <li 
                onClick={() => { setSelectedCategory(null); setPagination(p => ({...p, page: 1})); }}
                className={`cursor-pointer transition ${!selectedCategory ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Tất cả sản phẩm
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setPagination(p => ({...p, page: 1})); }}
                  className={`cursor-pointer transition ${selectedCategory === cat.id ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2 mt-8">Lọc theo giá</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-600 cursor-not-allowed opacity-50">
                <input type="radio" disabled name="price" className="form-radio text-blue-600" />
                <span>Dưới 2.000.000₫</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-600 cursor-not-allowed opacity-50">
                <input type="radio" disabled name="price" className="form-radio text-blue-600" />
                <span>2.000.000₫ - 5.000.000₫</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {searchKeyword 
                ? `Kết quả tìm kiếm cho "${searchKeyword}"`
                : (categories.find(c => c.id === selectedCategory)?.name || 'Tất cả sản phẩm')} 
              <span className="text-sm font-normal text-gray-400 ml-2">({pagination.total} sản phẩm)</span>
            </h1>
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
              <option>Sắp xếp: Mới nhất</option>
              <option>Giá: Thấp đến cao</option>
              <option>Giá: Cao đến thấp</option>
            </select>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="animate-pulse">
                   <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                   <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length > 0 ? products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    {/* Product Image */}
                    <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {product.primary_image ? (
                        <img 
                          src={imgUrl(product.primary_image)} 
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center opacity-20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {product.discount_pct > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                          SALE {product.discount_pct}%
                        </span>
                      )}
                    </div>
                    {/* Product Info */}
                    <div className="p-5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category_name}</p>
                      <h3 className="text-gray-900 font-bold mb-2 line-clamp-1 group-hover:text-blue-600 transition">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price * (1 - product.discount_pct / 100))}
                        </span>
                        {product.discount_pct > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                  Không tìm thấy sản phẩm nào trong danh mục này.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="mt-16 flex justify-center space-x-2">
              <button 
                onClick={() => setPagination(p => ({...p, page: Math.max(1, p.page - 1)}))}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Trước
              </button>
              <button className="px-4 py-2 border border-blue-600 rounded-lg bg-blue-600 text-white font-bold">
                {pagination.page}
              </button>
              <button 
                onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                disabled={products.length < pagination.limit}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition disabled:opacity-30"
              >
                Sau
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

