const pool = require('./db');
const bcrypt = require('bcrypt');

const seed = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    console.log('--- Bắt đầu đổ dữ liệu mẫu SONTD Furniture ---');

    // 0. Dữ liệu Người dùng (Users)
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      const saltRounds = 10;
      const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
      const userPassword = await bcrypt.hash('User@123', saltRounds);

      await connection.execute(`
        INSERT INTO users (full_name, email, phone, password_hash) VALUES
        ('Hệ thống Quản trị (Admin)', 'admin@sontd.vn', '0900000001', ?),
        ('Khách hàng mẫu (User)', 'user@gmail.com', '0912345678', ?)
      `, [adminPassword, userPassword]);
      console.log('+ Đã thêm Tài khoản mẫu: admin@sontd.vn / User@123');
    }

    // 1. Dữ liệu Danh mục Phòng (Room Categories)
    const [rooms] = await connection.execute('SELECT COUNT(*) as count FROM room_categories');
    if (rooms[0].count === 0) {
      await connection.execute(`
        INSERT INTO room_categories (name, slug, display_order) VALUES
        ('Phòng Ngủ', 'phong-ngu', 1),
        ('Phòng Khách', 'phong-khach', 2),
        ('Phòng Ăn', 'phong-an', 3),
        ('Phòng Làm Việc', 'phong-lam-viec', 4),
        ('Tủ Bếp', 'tu-bep', 5),
        ('Nệm', 'nem', 6)
      `);
      console.log('+ Đã thêm Danh mục Phòng');
    }

    // 2. Dữ liệu Bộ sưu tập (Collections)
    const [cols] = await connection.execute('SELECT COUNT(*) as count FROM collections');
    if (cols[0].count === 0) {
      await connection.execute(`
        INSERT INTO collections (name, slug, tagline) VALUES
        ('ASTRO', 'astro', 'Nét đẹp tinh tế từ vũ trụ'),
        ('SIGNATURE', 'noi-that-cao-cap-moho-furniture', 'Dấu ấn thượng lưu'),
        ('SCARLET', 'scarlet', 'Quyến rũ và sang trọng'),
        ('SERENA', 'serena-collection', 'Sự bình yên trong tâm hồn'),
        ('VLINE', 'vline-collection', 'Nét hiện đại thuần Việt')
      `);
      console.log('+ Đã thêm Bộ sưu tập');
    }

    // 3. Dữ liệu Danh mục Sản phẩm (Product Categories)
    const [pCats] = await connection.execute('SELECT COUNT(*) as count FROM product_categories');
    if (pCats[0].count === 0) {
      const [roomRows] = await connection.execute("SELECT id FROM room_categories WHERE slug = 'phong-ngu' LIMIT 1");
      const roomId = roomRows[0]?.id || null;

      await connection.execute(`
        INSERT INTO product_categories (room_id, name, slug) VALUES
        (?, 'Giường Ngủ', 'giuong-ngu'),
        (?, 'Tủ Đầu Giường', 'tu-dau-giuong'),
        (?, 'Nệm Foam', 'nem-foam'),
        (NULL, 'Sofa', 'sofa'),
        (NULL, 'Bàn Ăn', 'ban-an')
      `, [roomId, roomId, roomId]);
      console.log('+ Đã thêm Danh mục Sản phẩm');
    }

    // 4. Dữ liệu Thuộc tính (Attributes)
    const [attrTypes] = await connection.execute('SELECT COUNT(*) as count FROM attribute_types');
    if (attrTypes[0].count === 0) {
      await connection.execute(`
        INSERT INTO attribute_types (id, name) VALUES
        (1, 'Kích thước'),
        (2, 'Màu sắc'),
        (3, 'Chất liệu')
      `);
    }

    const [attrVals] = await connection.execute('SELECT COUNT(*) as count FROM attribute_values');
    if (attrVals[0].count === 0) {
      await connection.execute(`
        INSERT INTO attribute_values (type_id, value, color_hex, display_order) VALUES
        (1, '140 x 200 x 20 cm', NULL, 1),
        (1, '160 x 200 x 20 cm', NULL, 2),
        (1, '180 x 200 x 20 cm', NULL, 3),
        (2, 'Trắng', '#FFFFFF', 1),
        (2, 'Xám', '#808080', 2),
        (2, 'Gỗ tự nhiên', '#D2B48C', 3)
      `);
      console.log('+ Đã thêm Thuộc tính mẫu');
    }

    // 5. Dữ liệu Sản phẩm & Biến thể (Products & Variants)
    // Luôn dọn dẹp và nạp lại để khớp schema mới
    await connection.execute('DELETE FROM product_images');
    await connection.execute('DELETE FROM product_variants');
    await connection.execute('DELETE FROM products');

    const [[catGiuong]] = await connection.execute("SELECT id FROM product_categories WHERE slug = 'giuong-ngu' LIMIT 1");
    const [[catNem]] = await connection.execute("SELECT id FROM product_categories WHERE slug = 'nem-foam' LIMIT 1");
    const [[catBanAn]] = await connection.execute("SELECT id FROM product_categories WHERE slug = 'ban-an' LIMIT 1");
    const [[catSofa]] = await connection.execute("SELECT id FROM product_categories WHERE slug = 'sofa' LIMIT 1");
    const [[colVLine]] = await connection.execute("SELECT id FROM collections WHERE slug = 'vline-collection' LIMIT 1");
    const [[colSig]] = await connection.execute("SELECT id FROM collections WHERE slug = 'noi-that-cao-cap-moho-furniture' LIMIT 1");

    const productData = [
      {
        catId: catNem.id, colId: colSig.id, name: 'Nệm Foam Moho Sleep Balance', slug: 'nem-foam-moho-sleep-balance',
        sku: 'MMBFCF01', price: 8990000, discount: 11, is_feat: 1, 
        meta_title: 'Nệm Foam MOHO Sleep Balance - Êm Ái, Thoáng Khí | MOHO',
        meta_desc: 'Nệm foam MOHO Sleep Balance với mút hoạt tính 09 ILD, lõi cắt đặc biệt thoáng khí. Bảo hành 5 năm.',
        images: [
          { url: '/uploads/products/pro_nem_foam_moho_signature_02aeec7858054cf3892c50c11138f1e6_grande.png', primary: 1 },
          { url: '/uploads/products/pro_nem_foam_moho_balance_3_4f60f68a26914e5d8605c3d1d8416a4c_large.png', primary: 0 }
        ]
      },
      {
        catId: catGiuong.id, colId: colVLine.id, name: 'Giường Ngủ Gỗ VLINE 601', slug: 'giuong-ngu-go-vline-601',
        sku: 'VLINE-601-WOOD', price: 5490000, discount: 10, is_feat: 1,
        meta_title: 'Giường Ngủ Gỗ VLINE 601 - Gỗ Tự Nhiên, Sang Trọng',
        meta_desc: 'Giường ngủ hiện đại phong cách Việt, làm từ gỗ cao su tự nhiên đạt chuẩn xuất khẩu.',
        images: [
          { url: '/uploads/products/pro_mau_tu_nhien_giuong_go_cao_su_vline_noi_that_moho_1_641eaf90df4045019e8c134068caa1c2_large.png', primary: 1 }
        ]
      },
      {
        catId: catBanAn.id, colId: colSig.id, name: 'Bộ Bàn Ăn SERENA 4 Ghế', slug: 'bo-ban-an-serena',
        sku: 'SERENA-SET-4', price: 9500000, discount: 20, is_feat: 1,
        meta_title: 'Bộ Bàn Ăn SERENA 4 Ghế - Phong Cách Bắc Âu',
        meta_desc: 'Bộ bàn ăn SERENA kết hợp vẻ đẹp tự nhiên và thiết kế tối giản Nordic.',
        images: [
          { url: '/uploads/products/pro_mau_tu_nhien_bo_ban_an_4_ghe_6_ghe_serena_noi_that_moho_ban_an_1m6_238807752ee145c19f3e3ccdb43977d6_grande.jpg', primary: 1 }
        ]
      },
      {
        catId: catSofa.id, colId: colVLine.id, name: 'Sofa Băng VLINE Milan', slug: 'sofa-milan-vline',
        sku: 'SOFA-MILAN-01', price: 7990000, discount: 0, is_feat: 1,
        meta_title: 'Sofa Băng VLINE Milan - Êm Ái & Hiện Đại',
        meta_desc: 'Mẫu Sofa được săn đón nhất 2024, chất liệu vải cao cấp chống bám bụi.',
        images: [
          { url: '/uploads/products/noi-that-moho-sofa-vline-ban-sofa-milan_8e1b7b077e39491785f02cc4b9665b23_large.jpg', primary: 1 }
        ]
      }
    ];

    for (const p of productData) {
      // Insert Product
      await connection.execute(`
        INSERT INTO products (
          category_id, collection_id, name, slug, sku_base, base_price, 
          discount_pct, is_featured, meta_title, meta_description, 
          warranty_months, free_shipping, free_install
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.catId, p.colId, p.name, p.slug, p.sku, p.price, 
        p.discount, p.is_feat, p.meta_title, p.meta_desc, 
        60, 1, 1
      ]);

      const [pRows] = await connection.execute("SELECT id FROM products WHERE slug = ? LIMIT 1", [p.slug]);
      const productId = pRows[0].id;

      // Insert Variants
      await connection.execute(`
        INSERT INTO product_variants (product_id, sku, price_override, stock_qty) VALUES
        (?, ?, ?, ?)
      `, [productId, `${p.sku}-VAR`, p.price, 50]);

      // Insert Images
      for (const img of p.images) {
        await connection.execute(`
          INSERT INTO product_images (product_id, image_url, is_primary) VALUES
          (?, ?, ?)
        `, [productId, img.url, img.primary]);
      }
    }
    console.log(`+ Đã tái cấu trúc và thêm ${productData.length} sản phẩm với bảng Images riêng biệt.`);

    // 6. Mã giảm giá (Coupons)
    const [coupons] = await connection.execute('SELECT COUNT(*) as count FROM coupon_codes');
    if (coupons[0].count === 0) {
      await connection.execute(`
        INSERT INTO coupon_codes (code, discount_type, discount_value, min_order_value, starts_at, expires_at) VALUES
        ('SONTD10', 'percentage', 10, 2000000, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
        ('GIAM200K', 'fixed_amount', 200000, 1000000, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY))
      `);
      console.log('+ Đã thêm Mã giảm giá mẫu');
    }

    await connection.commit();
    console.log('--- Hoàn tất đổ dữ liệu mẫu thành công! ---');

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Lỗi khi seed data:', error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
};

seed();


