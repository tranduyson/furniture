import Link from "next/link";

export default function Checkout() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/cart" className="text-blue-600 font-medium hover:underline text-sm flex items-center gap-1">
            &larr; Quay lại Giỏ hàng
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Thanh Toán</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Info Forms */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Delivery Info Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Thông Tin Giao Hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ Tên *</label>
                  <input type="text" className="w-full border-gray-300 border rounded p-2.5 focus:ring focus:ring-blue-100 outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại *</label>
                  <input type="tel" className="w-full border-gray-300 border rounded p-2.5 focus:ring focus:ring-blue-100 outline-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full border-gray-300 border rounded p-2.5 focus:ring focus:ring-blue-100 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ Chi Tiết (Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP) *</label>
                  <textarea rows="3" className="w-full border-gray-300 border rounded p-2.5 focus:ring focus:ring-blue-100 outline-none" required></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng (Tùy chọn)</label>
                  <textarea rows="2" className="w-full border-gray-300 border rounded p-2.5 focus:ring focus:ring-blue-100 outline-none"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Phương Thức Thanh Toán</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 transition border-blue-500 bg-blue-50">
                  <input type="radio" name="payment" defaultChecked className="form-radio text-blue-600 h-5 w-5" />
                  <span className="ml-3 font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 transition">
                  <input type="radio" name="payment" className="form-radio text-blue-600 h-5 w-5" />
                  <span className="ml-3 font-medium text-gray-900">Thanh toán qua VNPAY / Momo</span>
                </label>
                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 transition">
                  <input type="radio" name="payment" className="form-radio text-blue-600 h-5 w-5" />
                  <span className="ml-3 font-medium text-gray-900">Chuyển khoản Ngân hàng</span>
                </label>
              </div>
            </div>
            
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Đơn Hàng (2 sản phẩm)</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded border flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate">Nệm Foam SONTD Sleep Balance</h4>
                    <p className="text-xs text-gray-500">SL: 1</p>
                    <p className="text-sm font-medium mt-1">8.990.000₫</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded border flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate">Giường Ngủ SONTD VBed</h4>
                    <p className="text-xs text-gray-500">SL: 1</p>
                    <p className="text-sm font-medium mt-1">5.490.000₫</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 border-t pt-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">14.480.000₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá mã Voucher</span>
                  <span className="font-medium text-red-600">-0₫</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 border-t pt-4">
                <span className="font-bold text-gray-900">TỔNG CỘNG</span>
                <span className="text-2xl font-extrabold text-blue-600">14.480.000₫</span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-200 uppercase tracking-wider text-sm mb-2">
                Hoàn Tất Đặt Hàng
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">Bằng việc đặt hàng, bạn đã đồng ý với Điều khoản Sử dụng & Chính sách bảo mật của SONTD.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
