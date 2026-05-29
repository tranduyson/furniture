"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductDetail({ params }) {
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [attrGroups, setAttrGroups] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const imgUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setMainImage(imgUrl(data.data.primary_image));
          // Trích xuất nhóm thuộc tính từ variants
          const groups = {};
          const initAttrs = {};
          if (data.data.variants) {
            data.data.variants.forEach(v => {
              (v.attribute_values || []).forEach(attr => {
                if (!groups[attr.type_name]) groups[attr.type_name] = { type_id: attr.type_id, values: [] };
                if (!groups[attr.type_name].values.find(x => x.attr_value_id === attr.attr_value_id)) {
                  groups[attr.type_name].values.push(attr);
                }
              });
            });
          }
          setAttrGroups(groups);
          // Chọn variant đầu tiên mặc định
          if (data.data.variants && data.data.variants.length > 0) {
            const first = data.data.variants[0];
            setSelectedVariant(first);
            setMainImage(imgUrl(first.image_url) || imgUrl(data.data.primary_image));
            // Set initial selected attrs from first variant
            (first.attribute_values || []).forEach(attr => {
              initAttrs[attr.type_name] = attr.attr_value_id;
            });
            setSelectedAttrs(initAttrs);
          }
          
          // Fetch related products (Lấy từ tất cả sản phẩm để đảm bảo luôn có data do DB demo ít sản phẩm)
          fetch(`${apiUrl}/api/products?limit=8`)
            .then(r => r.json())
            .then(res => {
              if (res.success && res.data && res.data.products) {
                // Loại bỏ sản phẩm hiện tại và lấy 4 cái đầu tiên
                setRelatedProducts(res.data.products.filter(p => p.id !== data.data.id).slice(0, 4));
              }
            })
            .catch(e => console.error("Lỗi lấy sản phẩm liên quan:", e));
        }
      } catch (e) {
        console.error("Lỗi lấy chi tiết sản phẩm:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, apiUrl]);

  const handleAddToCart = async () => {
    // Kiểm tra có variant không
    if (!selectedVariant) {
      setToast({
        type: 'error',
        message: 'Sản phẩm này hiện chưa có biến thể, không thể thêm vào giỏ hàng.',
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setAddingToCart(true);
    const token = localStorage.getItem('accessToken');

    // Lấy hoặc tạo session ID cho khách vãng lai
    let sessionId = localStorage.getItem('sessionId');
    if (!token && !sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sessionId', sessionId);
    }

    try {
      const res = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...(!token && sessionId && { 'x-session-id': sessionId }),
        },
        body: JSON.stringify({
          variant_id: selectedVariant.id,
          quantity: quantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Lưu sessionId từ server nếu có (khi server tự tạo)
        if (data.data?.sessionId) {
          localStorage.setItem('sessionId', data.data.sessionId);
        }
        setShowCartPreview(true);
        setToast({
          type: 'success',
          message: `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`,
        });
        
        // Đóng toast sau 3 giây
        setTimeout(() => setToast(null), 3000);
        
        // Đóng preview sau 5 giây
        setTimeout(() => setShowCartPreview(false), 5000);
      } else {
        setToast({
          type: 'error',
          message: data.message || 'Có lỗi khi thêm vào giỏ hàng',
        });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setToast({
        type: 'error',
        message: 'Không thể kết nối đến server',
      });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 1000);
  };

  return (
    <div className="bg-white pt-8 pb-20">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Đang tải sản phẩm...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && !product && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Sản phẩm không tồn tại</h2>
          <p className="text-gray-500 mb-8">Sản phẩm bạn đang tìm có thể đã bị xóa hoặc không còn sẵn.</p>
          <Link href="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      )}

      {/* Main Content */}
      {!loading && product && (
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-12 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition font-medium">Trang chủ</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="hover:text-blue-600 transition font-medium">Tất cả sản phẩm SONDT</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-semibold">{product?.category_name}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-bold">{product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: Product Image Gallery - Moho Style */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="mb-6 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-square relative group">
              {mainImage ? (
                <img 
                  src={mainImage}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Zoom Icon */}
              <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product?.images && product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <button key={img.id || i}
                    onClick={() => setMainImage(imgUrl(img.image_url))}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${mainImage === imgUrl(img.image_url) ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={imgUrl(img.image_url)} alt={img.alt_text || product?.name} className="w-full h-full object-cover" />
                  </button>
                ))
              ) : (
                <button
                  onClick={() => setMainImage(imgUrl(product?.primary_image))}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-blue-600"
                >
                  <img src={imgUrl(product?.primary_image)} alt="Main" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Product Details - Moho Style */}
          <div className="lg:col-span-2">
            {/* Category & Title */}
            <div className="mb-6">
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">SONTD Collection</p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">{product?.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-blue-600 font-bold">
                  SKU: <span className="text-gray-700">{product?.sku_base}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">Tồn kho: <span className="text-blue-600 font-bold">{selectedVariant?.stock_qty ?? '—'} chiếc</span></span>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-8 pb-8 border-b border-gray-100 flex items-start gap-6">
              <div>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl font-black text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.base_price * (1 - product?.discount_pct / 100))}
                  </span>
                  {product?.discount_pct > 0 && (
                    <span className="text-2xl text-gray-400 line-through">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.base_price)}
                    </span>
                  )}
                </div>
                {product?.discount_pct > 0 && (
                  <div className="inline-block">
                    <span className="bg-red-600 text-white px-4 py-1.5 text-sm font-black rounded-lg shadow-lg">
                      -GIẢM {product?.discount_pct}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Attribute Selection */}
            {Object.keys(attrGroups).length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100 space-y-6">
                {Object.entries(attrGroups).map(([typeName, group]) => (
                  <div key={typeName}>
                    <label className="text-lg font-bold text-gray-900 mb-4 block">{typeName}</label>
                    <div className="flex gap-3 flex-wrap">
                      {group.values.map(attr => {
                        const isSelected = selectedAttrs[typeName] === attr.attr_value_id;
                        return (
                          <button
                            key={attr.attr_value_id}
                            onClick={() => {
                              const newAttrs = { ...selectedAttrs, [typeName]: attr.attr_value_id };
                              setSelectedAttrs(newAttrs);
                              // Tìm variant phù hợp với tổ hợp thuộc tính đã chọn
                              if (product?.variants) {
                                const match = product.variants.find(v => {
                                  const vAttrs = v.attribute_values || [];
                                  return Object.entries(newAttrs).every(([tn, avId]) =>
                                    vAttrs.some(a => a.type_name === tn && a.attr_value_id === avId)
                                  );
                                });
                                if (match) {
                                  setSelectedVariant(match);
                                  setMainImage(imgUrl(match.image_url) || imgUrl(product?.primary_image) || mainImage);
                                }
                              }
                            }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold transition ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                          >
                            {attr.color_hex && (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: attr.color_hex }}></div>
                            )}
                            {attr.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Variant Info */}
            {selectedVariant && (
              <div className="mb-10 pb-10 border-b border-gray-100 space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">SKU biến thể:</span>
                  <span className="font-bold text-gray-900">{selectedVariant.sku}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Tồn kho:</span>
                  <span className={`font-bold ${selectedVariant.stock_qty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedVariant.stock_qty > 0 ? `Còn ${selectedVariant.stock_qty} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
                {selectedVariant.attribute_values && selectedVariant.attribute_values.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVariant.attribute_values.map(attr => (
                      <span key={attr.attr_value_id} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 text-xs font-semibold text-blue-700">
                        {attr.color_hex && <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: attr.color_hex }}></span>}
                        <span className="text-blue-500">{attr.type_name}:</span> {attr.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Buttons */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl h-16 bg-white overflow-hidden w-fit shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={addingToCart}
                    className="w-16 h-full flex items-center justify-center hover:bg-gray-50 text-2xl text-gray-400 transition disabled:opacity-50"
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    readOnly 
                    value={quantity} 
                    className="w-16 h-full text-center font-black text-xl text-gray-900 focus:outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={addingToCart}
                    className="w-16 h-full flex items-center justify-center hover:bg-gray-50 text-2xl text-gray-400 transition disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white h-16 rounded-xl font-black text-lg transition-all duration-300 shadow-lg shadow-blue-200 uppercase tracking-wider flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {addingToCart ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Thêm Vào Giỏ
                  </>
                )}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white h-16 rounded-xl font-black text-lg transition-all duration-300 shadow-lg shadow-red-200 uppercase tracking-wider"
              >
                Mua Ngay - Giao Nhanh 24H
              </button>
            </div>

            {/* Shipping & Warranty Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900">Miễn phí giao hàng & lắp đặt tại tất cả quận huyện</p>
                    <p className="text-sm text-gray-600 mt-1">TP HCM, Hà Nội, Khu đô thị Ecopark, Biên Hòa và một số quận huyện khác (*)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900">Miễn phí 1 đổi 1 - Bảo hành 5 năm</p>
                    <p className="text-sm text-gray-600 mt-1">Bảo trì toàn bộ chi tiết trong 5 năm (*)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="font-bold text-gray-900">(*) Không áp dụng cho danh mục Bộ Trưng Bày, Clearance. Chỉ bảo hành 01 năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-t border-gray-100 pt-10">
          <div className="flex gap-12 mb-10 border-b border-gray-100 overflow-x-auto">
            {['Chi Tiết Sản Phẩm', 'Thông Số Kỹ Thuật', 'Đánh Giá Khách Hàng'].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(['desc', 'specs', 'reviews'][i])}
                className={`pb-4 font-bold text-lg whitespace-nowrap transition-all ${
                  activeTab === ['desc', 'specs', 'reviews'][i]
                    ? 'text-gray-900 border-b-4 border-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'desc' && (
              <div className="prose max-w-4xl text-gray-600 text-lg leading-relaxed space-y-6">
                <p>{product?.meta_description || product?.short_desc}</p>
                <p>
                  Ghế sofa SONTD MOCHI được thiết kế với mục đích mang lại sự thoải mái tối đa cho gia đình bạn. 
                  Với những đường nét mượt mà, màu sắc tinh tế, nó vừa là một vật dụng thiết thực vừa là một điểm nhấn 
                  trang trí tinh mĩ cho phòng khách của bạn.
                </p>
                <p>
                  Sản phẩm được chế tác từ những vật liệu bền bỉ nhất, đạt chuẩn xuất khẩu quốc tế, 
                  an toàn cho toàn gia đình. SONTD cam kết sẽ mang đến cho bạn những trải nghiệm mua sắm tuyệt vời nhất.
                </p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="max-w-3xl border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <tbody>
                    {[
                      { label: 'Mã Sản Phẩm', value: product?.sku_base },
                      { label: 'Danh Mục', value: product?.category_name },
                      // Dynamic: thêm từng thuộc tính type từ attrGroups
                      ...Object.entries(attrGroups).map(([typeName, group]) => ({
                        label: typeName,
                        value: group.values.map(v => v.value).join(', ')
                      })),
                      // Dynamic: specs từ DB
                      ...(product?.specs || []).map(s => ({
                        label: s.spec_key,
                        value: s.spec_value
                      })),
                      { label: 'Bảo Hành', value: `${product?.warranty_months || 5} tháng` },
                      { label: 'Vận Chuyển', value: product?.free_shipping ? 'Miễn phí' : 'Có phí' },
                      { label: 'Lắp Đặt', value: product?.free_install ? 'Miễn phí' : 'Có phí' },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <th className="p-6 text-gray-500 font-bold uppercase text-xs w-48">{row.label}</th>
                        <td className="p-6 text-gray-900 font-semibold">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="bg-gray-50 rounded-2xl p-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 min-h-96">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2l-4 4z" />
                </svg>
                <p className="text-gray-400 italic text-lg">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                  Viết Đánh Giá
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Gợi ý sản phẩm liên quan */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-100 mt-10">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-black text-gray-900">Có thể bạn sẽ thích</h2>
            <Link href="/products" className="text-blue-600 font-semibold hover:underline hidden sm:block">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <Link href={`/products/${p.slug}`} key={p.id} className="group block">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                  <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                    {p.primary_image ? (
                      <img src={imgUrl(p.primary_image)} alt={p.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500" />
                    ) : (
                      <div className="flex flex-col items-center opacity-20">
                        <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    {p.discount_pct > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase">SALE {p.discount_pct}%</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{p.category_name}</p>
                    <h3 className="text-gray-900 font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition flex-1">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-lg font-black text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.base_price * (1 - p.discount_pct / 100))}
                      </span>
                      {p.discount_pct > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.base_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl text-white font-bold ${
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

      {/* Cart Preview Modal - Moho Style */}
      {showCartPreview && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-end">
          {/* Overlay */}
          <button 
            onClick={() => setShowCartPreview(false)}
            className="absolute inset-0 bg-black/20 transition-opacity"
          ></button>

          {/* Cart Preview */}
          <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:w-96 shadow-2xl animate-slideUp md:mr-6">
            {/* Close Button */}
            <button
              onClick={() => setShowCartPreview(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-3xl md:rounded-t-3xl">
              <h3 className="text-xl font-black">GIỎ HÀNG</h3>
              <p className="text-blue-100 text-sm mt-1">Bạn vừa thêm sản phẩm</p>
            </div>

            {/* Item */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={imgUrl(product?.primary_image)} alt={product?.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 line-clamp-2">{product?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">Số lượng: {quantity}</p>
                  <p className="text-lg font-black text-blue-600 mt-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.base_price * (1 - product?.discount_pct / 100) * quantity)}
                  </p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-bold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.base_price * (1 - product?.discount_pct / 100) * quantity)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-bold text-green-600">Miễn phí</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Tổng tiền:</span>
              <span className="text-3xl font-black text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.base_price * (1 - product?.discount_pct / 100) * quantity)}
              </span>
            </div>

            {/* Buttons */}
            <div className="p-6 space-y-3">
              <Link href="/cart" className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-3 rounded-xl text-center transition">
                XEM GIỎ HÀNG
              </Link>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition">
                THANH TOÁN
              </button>
              <button 
                onClick={() => setShowCartPreview(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

