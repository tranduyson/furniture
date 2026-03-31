import Link from "next/link";

export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ Hàng Của Bạn</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <span className="w-1/2">Sản Phẩm</span>
              <span className="w-1/6 text-center">Đơn Giá</span>
              <span className="w-1/6 text-center">Số Lượng</span>
              <span className="w-1/6 text-right">Thành Tiền</span>
            </div>
            
            <div className="p-6 divide-y divide-gray-100">
              {/* Product 1 */}
              <div className="py-6 flex items-center justify-between">
                <div className="w-1/2 flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border">
                    <img src="/uploads/products/pro_nem_foam_moho_signature_02aeec7858054cf3892c50c11138f1e6_grande.png" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Nệm Foam SONTD Signature</h3>
                    <p className="text-sm text-gray-500 mb-2">160 x 200 x 20 cm</p>
                    <button className="text-red-500 text-sm font-medium hover:text-red-700">Xóa</button>
                  </div>
                </div>
                <div className="w-1/6 text-center font-medium text-gray-700">12.990.000₫</div>
                <div className="w-1/6 flex justify-center">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden w-24">
                    <button className="w-8 bg-gray-50 hover:bg-gray-100 font-medium">-</button>
                    <input type="number" readOnly value="1" className="flex-1 text-center border-x border-gray-300 text-sm focus:outline-none font-bold" />
                    <button className="w-8 bg-gray-50 hover:bg-gray-100 font-medium">+</button>
                  </div>
                </div>
                <div className="w-1/6 text-right font-bold text-gray-900">12.990.000₫</div>
              </div>

              {/* Product 2 */}
              <div className="py-6 flex items-center justify-between">
                <div className="w-1/2 flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border">
                    <img src="/uploads/products/pro_mau_tu_nhien_giuong_go_cao_su_vline_noi_that_moho_1_641eaf90df4045019e8c134068caa1c2_large.png" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Giường Ngủ Gỗ VLINE 601</h3>
                    <p className="text-sm text-gray-500 mb-2">Gỗ cao su tự nhiên</p>
                    <button className="text-red-500 text-sm font-medium hover:text-red-700">Xóa</button>
                  </div>
                </div>
                <div className="w-1/6 text-center font-medium text-gray-700">5.490.000₫</div>
                <div className="w-1/6 flex justify-center">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden w-24">
                    <button className="w-8 bg-gray-50 hover:bg-gray-100 font-medium">-</button>
                    <input type="number" readOnly value="1" className="flex-1 text-center border-x border-gray-300 text-sm focus:outline-none font-bold" />
                    <button className="w-8 bg-gray-50 hover:bg-gray-100 font-medium">+</button>
                  </div>
                </div>
                <div className="w-1/6 text-right font-bold text-gray-900">5.490.000₫</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm Tắt Đơn Hàng</h2>
            
            <div className="space-y-4 mb-6 text-sm text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span>Tạm tính (2 sản phẩm)</span>
                <span className="font-medium text-gray-900">14.480.000₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá</span>
                <span className="font-medium text-red-600">-0₫</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã Giảm Giá</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Nhập mã ưu đãi" className="flex-1 border rounded p-2 focus:ring focus:ring-blue-100 outline-none" />
                <button className="bg-gray-800 text-white px-4 py-2 rounded font-medium hover:bg-gray-900 transition">Áp dụng</button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900">Tổng Tiền</span>
              <span className="text-2xl font-extrabold text-blue-600">14.480.000₫</span>
            </div>

            <Link href="/checkout" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-200 mb-4 uppercase tracking-wide">
              Tiến Hành Thanh Toán
            </Link>
            
            <Link href="/products" className="block text-center text-blue-600 font-medium hover:underline text-sm">
              &larr; Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
