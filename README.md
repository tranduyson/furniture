# HỆ THỐNG E-COMMERCE NODE.JS & NEXT.JS (SONTD FURNITURE)

Dự án này là một hệ thống mua sắm trực tuyến chuyên về đồ nội thất, được xây dựng theo kiến trúc Backend và Frontend tách biệt.

## 1. Cấu trúc Công nghệ

### Cơ Sở Dữ Liệu (MySQL)
- Toàn bộ thiết kế dữ liệu được chứa trong file `furniture_ecommerce.sql`.
- Hỗ trợ lưu trữ: Người dùng, Sản phẩm (kèm biến thể, hình ảnh, thuộc tính), Giỏ hàng, Đơn hàng, Mã giảm giá, Reviews, Hệ thống Blog và Cửa hàng.
- Sử dụng **Stored Procedure** (như `calculate_cart_total`) để thực hiện tính toán giá trị giỏ hàng trực tiếp dưới database.

### Backend (Express.js) - Thư mục `backend/`
- **Framework**: Node.js & Express.js.
- **Kiến trúc**: 3 lớp an toàn (Controller - Service - Repository).
- **Thư viện chính**:
  - `mysql2`: Kết nối Database thông qua Connection Pool và Transaction (bảo đảm an toàn khi checkout).
  - `jsonwebtoken` / `bcrypt`: Xử lý xác thực người dùng và mã hóa mật khẩu an toàn.
  - `cors` / `uuid`: Quản lý bảo mật Cross-origin và định danh session.
- **Chức năng chính đã triển khai**:
  - `Auth`: Đăng ký, đăng nhập (Cấp Access/Refresh Token).
  - `Products`: API lấy danh sách Catalogue (Sản phẩm nổi bật, Khuyến mãi, Bộ sưu tập).
  - `Cart`: Thêm giỏ hàng (hỗ trợ Session ID nếu khách chưa đăng nhập), Áp dụng mã Coupon.
  - `Order`: Checkout (sử dụng Database Transaction MySQL).

### Frontend (Next.js) - Thư mục `frontend/`
- **Framework**: Next.js (App Router) của React.
- **Giao diện**: TailwindCSS (Responsive layout cho Mobile & Desktop).
- **Các trang (Pages) tiêu biểu**:
  - `app/page.js`: Trang chủ (Banner, Collections).
  - `app/products/page.js`: Hệ thống danh sách lọc sản phẩm.
  - `app/products/[slug]/page.js`: Xem chi tiết sản phẩm, chọn kích thước, thêm giỏ hàng.
  - `app/cart/page.js`: Quản lý số lượng, áp mã giảm giá.
  - `app/checkout/page.js`: Nhập địa chỉ, Phương thức thanh toán (COD, VNPAY, Ngân hàng).
  - Hệ thống xác thực `(auth)/login` và `(auth)/register`.

---

## 2. Hướng dẫn chạy dự án

### Bước 1: Thiết lập Database
- Mở MySQL Client (như phpMyAdmin, DBeaver, MySQL Workbench).
- Import file `furniture_ecommerce.sql` để tạo database và dữ liệu mẫu.

### Bước 2: Chạy Backend API
1. Mở Terminal / CMD, trỏ vào đường dẫn thư mục `backend`.
2. Tạo file `.env` nếu cần, cấu hình database:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=furniture
   JWT_SECRET=yoursecret
   ```
3. Cài đặt thư viện: `npm install`
4. Khởi tạo dữ liệu mẫu (Seed Data):
   ```bash
   npm run seed
   ```
   *Lệnh này sẽ tạo các Danh mục, Sản phẩm và Tài khoản mẫu để bạn trải nghiệm ngay.*
5. Chạy Backend: `npm run start` (mặc định tại Port 5000).

### Bước 3: Chạy Frontend Web
1. Mở Terminal / CMD mới, trỏ vào thư mục `frontend`.
2. Tạo file `.env.local` để cấu hình API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Cài đặt thư viện: `npm install`
4. Chạy Server Giao diện: `npm run dev`
5. Mở trình duyệt truy cập: `http://localhost:3000`

---

## 3. Kiểm thử API (Testing API)

Hệ thống hỗ trợ 2 cách để bạn kiểm thử API dễ dàng:

### Cách 1: Swagger UI (Trực quan)
- Sau khi chạy Backend, truy cập: `http://localhost:5000/api-docs`
- Bạn có thể xem tài liệu chi tiết và chạy thử trực tiếp.

### Cách 2: Postman Collection (Nâng cao)
- Mình đã chuẩn bị sẵn file [postman_collection.json](file:///e:/sinhvien/furniture/backend/postman_collection.json).
- **Cách dùng**: Mở Postman -> Import -> Chọn file này.
- **Tính năng**: 
  - Đã gom nhóm theo Auth, Products, Cart, Orders.
  - Sau khi gọi API **Login**, script sẽ tự động lưu `accessToken` vào môi trường (Environment) để bạn dùng cho các API yêu cầu đăng nhập tiếp theo.

---

## 4. Tài khoản trải nghiệm mẫu (Default Accounts)

Sau khi chạy `npm run seed`, bạn có thể đăng nhập bằng các tài khoản sau:

- **Admin Account**:
  - Email: `admin@sontd.vn`
  - Password: `Admin@123`
- **Customer Account**:
  - Email: `user@gmail.com`
  - Password: `User@123`

---

## 4. Quản lý luồng Đặt Hàng (Checkout Flow) - Điểm lưu ý
Khi Khách hàng nhấn "Hoàn tất đặt hàng", luồng logic ở Backend (trong `order.service.js` & `order.repository.js`) sẽ thực thi một **MySQL Transaction**:
1. Thêm bản ghi vào bảng `orders`.
2. Lặp qua giỏ hàng, chèn vào `order_items` và trừ số lượng `stock_qty` trong kho.
3. Thay đổi trạng thái sang "pending" tại bảng `order_status_history`.
4. Nếu mã giảm giá hợp lệ tồn tại, tăng biến `used_count` cho thẻ voucher.
5. Cuối cùng, **xoá/làm sạch giỏ hàng** `cart_items`.
=> Nếu 1 trong 5 bước thất bại, toàn bộ quá trình sẽ được `Rollback` lại như lúc chưa Checkout.
