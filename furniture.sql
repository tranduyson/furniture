-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 11:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `furniture`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculate_cart_total` (IN `p_cart_id` BIGINT UNSIGNED, OUT `p_subtotal` DECIMAL(15,0), OUT `p_discount` DECIMAL(15,0), OUT `p_total` DECIMAL(15,0), OUT `p_coupon_code` VARCHAR(50), OUT `p_discount_type` VARCHAR(20))   BEGIN
    DECLARE v_coupon_id         INT UNSIGNED;
    DECLARE v_discount_type     VARCHAR(20);
    DECLARE v_discount_value    DECIMAL(12,2);
    DECLARE v_min_order_value   DECIMAL(15,0);
    DECLARE v_is_active         TINYINT(1);
    DECLARE v_expires_at        DATETIME;
    DECLARE v_code              VARCHAR(50);

    -- Tính subtotal
    SELECT COALESCE(SUM(ci.quantity * ci.unit_price), 0)
    INTO p_subtotal
    FROM cart_items ci
    WHERE ci.cart_id = p_cart_id;

    -- Lấy thông tin coupon đang áp dụng
    SELECT cc.id, cc.code, cc.discount_type, cc.discount_value,
           cc.min_order_value, cc.is_active, cc.expires_at
    INTO v_coupon_id, v_code, v_discount_type, v_discount_value,
         v_min_order_value, v_is_active, v_expires_at
    FROM carts c
    JOIN coupon_codes cc ON cc.id = c.coupon_id
    WHERE c.id = p_cart_id
      AND cc.is_active = 1
      AND (cc.expires_at IS NULL OR cc.expires_at > NOW())
      AND p_subtotal >= cc.min_order_value
    LIMIT 1;

    -- Tính discount
    SET p_discount = 0;
    IF v_coupon_id IS NOT NULL THEN
        IF v_discount_type = 'fixed_amount' THEN
            SET p_discount = LEAST(v_discount_value, p_subtotal);
        ELSEIF v_discount_type = 'percentage' THEN
            SET p_discount = ROUND(p_subtotal * v_discount_value / 100);
        END IF;
    END IF;

    SET p_total         = GREATEST(p_subtotal - p_discount, 0);
    SET p_coupon_code   = v_code;
    SET p_discount_type = v_discount_type;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `attribute_types`
--

CREATE TABLE `attribute_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attribute_types`
--

INSERT INTO `attribute_types` (`id`, `name`) VALUES
(3, 'Chất liệu'),
(1, 'Kích thước'),
(2, 'Màu sắc');

-- --------------------------------------------------------

--
-- Table structure for table `attribute_values`
--

CREATE TABLE `attribute_values` (
  `id` int(10) UNSIGNED NOT NULL,
  `type_id` int(10) UNSIGNED NOT NULL,
  `value` varchar(100) NOT NULL,
  `color_hex` varchar(7) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attribute_values`
--

INSERT INTO `attribute_values` (`id`, `type_id`, `value`, `color_hex`, `display_order`) VALUES
(1, 1, '140 x 200 x 20 cm', NULL, 1),
(2, 1, '160 x 200 x 20 cm', NULL, 2),
(3, 1, '180 x 200 x 20 cm', NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `display_name` varchar(150) NOT NULL,
  `bio` text DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `cover_image_url` text DEFAULT NULL,
  `meta_title` varchar(70) DEFAULT NULL,
  `meta_description` varchar(160) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `parent_id`, `description`, `cover_image_url`, `meta_title`, `meta_description`, `display_order`, `is_active`) VALUES
(1, 'Tips', 'noi-that-ung-dung', NULL, NULL, NULL, NULL, NULL, 1, 1),
(2, 'Thi công - Thiết kế', 'thi-cong-noi-that-thiet-ke-noi-that', NULL, NULL, NULL, NULL, NULL, 2, 1),
(3, 'Media', 'media', NULL, NULL, NULL, NULL, NULL, 3, 1),
(4, 'News', 'news', NULL, NULL, NULL, NULL, NULL, 4, 1),
(5, 'People', 'people', NULL, NULL, NULL, NULL, NULL, 5, 1),
(6, 'Inspiration', 'inspiration', NULL, NULL, NULL, NULL, NULL, 6, 1),
(7, 'Báo chí', 'bao-chi', NULL, NULL, NULL, NULL, NULL, 7, 1),
(8, 'Nệm', 'nem-blog', NULL, NULL, NULL, NULL, NULL, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `author_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `cover_image_url` text DEFAULT NULL,
  `cover_image_alt` varchar(200) DEFAULT NULL,
  `meta_title` varchar(70) DEFAULT NULL,
  `meta_description` varchar(160) DEFAULT NULL,
  `focus_keyword` varchar(150) DEFAULT NULL,
  `canonical_url` text DEFAULT NULL,
  `schema_type` varchar(30) NOT NULL DEFAULT 'Article',
  `reading_time_min` smallint(6) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `view_count` int(11) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `blog_posts`
--
DELIMITER $$
CREATE TRIGGER `trg_blog_posts_updated_at` BEFORE UPDATE ON `blog_posts` FOR EACH ROW BEGIN
    SET NEW.updated_at = NOW();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `blog_post_products`
--

CREATE TABLE `blog_post_products` (
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `link_type` varchar(30) NOT NULL DEFAULT 'featured',
  `display_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_post_tags`
--

CREATE TABLE `blog_post_tags` (
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_tags`
--

CREATE TABLE `blog_tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `coupon_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` smallint(6) NOT NULL DEFAULT 1,
  `unit_price` decimal(15,0) NOT NULL,
  `added_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `cover_image_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `name`, `slug`, `tagline`, `cover_image_url`, `description`, `display_order`, `is_active`) VALUES
(1, 'ASTRO', 'astro', NULL, NULL, NULL, 0, 1),
(2, 'SIGNATURE', 'noi-that-cao-cap-moho-furniture', NULL, NULL, NULL, 0, 1),
(3, 'SCARLET', 'scarlet', NULL, NULL, NULL, 0, 1),
(4, 'SERENA', 'serena-collection', NULL, NULL, NULL, 0, 1),
(5, 'PLANK', 'plank', NULL, NULL, NULL, 0, 1),
(6, 'KLINE', 'kline-collection', NULL, NULL, NULL, 0, 1),
(7, 'VLINE', 'vline-collection', NULL, NULL, NULL, 0, 1),
(8, 'VIENNA', 'vienna-collection', NULL, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `coupon_codes`
--

CREATE TABLE `coupon_codes` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` varchar(20) NOT NULL,
  `discount_value` decimal(12,2) NOT NULL,
  `min_order_value` decimal(15,0) NOT NULL DEFAULT 0,
  `max_uses` int(11) DEFAULT NULL,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `max_uses_per_user` smallint(6) NOT NULL DEFAULT 1,
  `starts_at` datetime NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupon_codes`
--

INSERT INTO `coupon_codes` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_uses`, `used_count`, `max_uses_per_user`, `starts_at`, `expires_at`, `is_active`, `created_at`) VALUES
(1, 'SONTD10', 'percentage', 10.00, 2000000, NULL, 0, 1, '2026-03-31 13:58:52', '2026-04-30 13:58:52', 1, '2026-03-31 13:58:52'),
(2, 'GIAM200K', 'fixed_amount', 200000.00, 1000000, NULL, 0, 1, '2026-03-31 13:58:52', '2026-04-15 13:58:52', 1, '2026-03-31 13:58:52');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_code` varchar(30) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `recipient_name` varchar(150) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `shipping_address` text NOT NULL,
  `subtotal` decimal(15,0) NOT NULL,
  `discount_amount` decimal(15,0) NOT NULL DEFAULT 0,
  `shipping_fee` decimal(15,0) NOT NULL DEFAULT 0,
  `total_amount` decimal(15,0) NOT NULL,
  `coupon_id` int(10) UNSIGNED DEFAULT NULL,
  `coupon_code_snapshot` varchar(50) DEFAULT NULL,
  `payment_method` enum('cod','bank_transfer','vnpay','momo','zalopay','installment') NOT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'unpaid',
  `order_status` enum('pending','confirmed','processing','shipping','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_sku` varchar(100) NOT NULL,
  `variant_attrs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variant_attrs`)),
  `unit_price` decimal(15,0) NOT NULL,
  `quantity` smallint(6) NOT NULL,
  `line_total` decimal(15,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` enum('pending','confirmed','processing','shipping','delivered','cancelled','refunded') DEFAULT NULL,
  `to_status` enum('pending','confirmed','processing','shipping','delivered','cancelled','refunded') NOT NULL,
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_tokens`
--

CREATE TABLE `otp_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `contact` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `purpose` varchar(30) NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `collection_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `sku_base` varchar(80) NOT NULL,
  `description` text DEFAULT NULL,
  `short_desc` varchar(500) DEFAULT NULL,
  `base_price` decimal(15,0) NOT NULL,
  `discount_pct` smallint(6) NOT NULL DEFAULT 0,
  `total_sold` int(11) NOT NULL DEFAULT 0,
  `is_combo` tinyint(1) NOT NULL DEFAULT 0,
  `is_outlet` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `meta_title` varchar(70) DEFAULT NULL,
  `meta_description` varchar(160) DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `warranty_months` smallint(6) NOT NULL DEFAULT 60,
  `free_shipping` tinyint(1) NOT NULL DEFAULT 1,
  `free_install` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `collection_id`, `name`, `slug`, `sku_base`, `description`, `short_desc`, `base_price`, `discount_pct`, `total_sold`, `is_combo`, `is_outlet`, `is_featured`, `is_active`, `meta_title`, `meta_description`, `meta_keywords`, `warranty_months`, `free_shipping`, `free_install`, `created_at`, `updated_at`) VALUES
(3, 3, 2, 'Nệm Foam Moho Sleep Balance', 'nem-foam-moho-sleep-balance', 'MMBFCF01', NULL, NULL, 8990000, 11, 0, 0, 0, 1, 1, 'Nệm Foam MOHO Sleep Balance - Êm Ái, Thoáng Khí | MOHO', 'Nệm foam MOHO Sleep Balance với mút hoạt tính 09 ILD, lõi cắt đặc biệt thoáng khí. Bảo hành 5 năm.', NULL, 60, 1, 1, '2026-03-31 15:07:28', '2026-03-31 15:07:28'),
(4, 1, 7, 'Giường Ngủ Gỗ VLINE 601', 'giuong-ngu-go-vline-601', 'VLINE-601-WOOD', NULL, NULL, 5490000, 10, 0, 0, 0, 1, 1, 'Giường Ngủ Gỗ VLINE 601 - Gỗ Tự Nhiên, Sang Trọng', 'Giường ngủ hiện đại phong cách Việt, làm từ gỗ cao su tự nhiên đạt chuẩn xuất khẩu.', NULL, 60, 1, 1, '2026-03-31 15:07:28', '2026-03-31 15:07:28'),
(5, 5, 2, 'Bộ Bàn Ăn SERENA 4 Ghế', 'bo-ban-an-serena', 'SERENA-SET-4', NULL, NULL, 9500000, 20, 0, 0, 0, 1, 1, 'Bộ Bàn Ăn SERENA 4 Ghế - Phong Cách Bắc Âu', 'Bộ bàn ăn SERENA kết hợp vẻ đẹp tự nhiên và thiết kế tối giản Nordic.', NULL, 60, 1, 1, '2026-03-31 15:07:28', '2026-03-31 15:07:28'),
(6, 4, 7, 'Sofa Băng VLINE Milan', 'sofa-milan-vline', 'SOFA-MILAN-01', NULL, NULL, 7990000, 0, 0, 0, 0, 1, 1, 'Sofa Băng VLINE Milan - Êm Ái & Hiện Đại', 'Mẫu Sofa được săn đón nhất 2024, chất liệu vải cao cấp chống bám bụi.', NULL, 60, 1, 1, '2026-03-31 15:07:28', '2026-03-31 15:07:28');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `room_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_url` text DEFAULT NULL,
  `meta_title` varchar(70) DEFAULT NULL,
  `meta_description` varchar(160) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `room_id`, `name`, `slug`, `description`, `thumbnail_url`, `meta_title`, `meta_description`, `display_order`, `is_active`) VALUES
(1, 1, 'Giường Ngủ', 'giuong-ngu', NULL, NULL, NULL, NULL, 0, 1),
(2, 1, 'Tủ Đầu Giường', 'tu-dau-giuong', NULL, NULL, NULL, NULL, 0, 1),
(3, 1, 'Nệm Foam', 'nem-foam', NULL, NULL, NULL, NULL, 0, 1),
(4, NULL, 'Sofa', 'sofa', NULL, NULL, NULL, NULL, 0, 1),
(5, NULL, 'Bàn Ăn', 'ban-an', NULL, NULL, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` text NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `display_order`, `is_primary`) VALUES
(1, 3, '/uploads/products/pro_nem_foam_moho_signature_02aeec7858054cf3892c50c11138f1e6_grande.png', NULL, 0, 1),
(2, 3, '/uploads/products/pro_nem_foam_moho_balance_3_4f60f68a26914e5d8605c3d1d8416a4c_large.png', NULL, 0, 0),
(3, 4, '/uploads/products/pro_mau_tu_nhien_giuong_go_cao_su_vline_noi_that_moho_1_641eaf90df4045019e8c134068caa1c2_large.png', NULL, 0, 1),
(4, 5, '/uploads/products/pro_mau_tu_nhien_bo_ban_an_4_ghe_6_ghe_serena_noi_that_moho_ban_an_1m6_238807752ee145c19f3e3ccdb43977d6_grande.jpg', NULL, 0, 1),
(5, 6, '/uploads/products/noi-that-moho-sofa-vline-ban-sofa-milan_8e1b7b077e39491785f02cc4b9665b23_large.jpg', NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` smallint(6) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `comment` text NOT NULL,
  `reviewer_name` varchar(150) DEFAULT NULL,
  `quality_rating` smallint(6) DEFAULT NULL,
  `delivery_rating` smallint(6) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `is_verified_purchase` tinyint(1) NOT NULL DEFAULT 0,
  `helpful_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_specs`
--

CREATE TABLE `product_specs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `spec_key` varchar(120) NOT NULL,
  `spec_value` text NOT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(100) NOT NULL,
  `price_override` decimal(15,0) DEFAULT NULL,
  `stock_qty` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price_override`, `stock_qty`, `is_active`, `created_at`) VALUES
(6, 3, 'MMBFCF01-VAR', 8990000, 50, 1, '2026-03-31 15:07:28'),
(7, 4, 'VLINE-601-WOOD-VAR', 5490000, 50, 1, '2026-03-31 15:07:28'),
(8, 5, 'SERENA-SET-4-VAR', 9500000, 50, 1, '2026-03-31 15:07:28'),
(9, 6, 'SOFA-MILAN-01-VAR', 7990000, 50, 1, '2026-03-31 15:07:28');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `promo_type` varchar(30) NOT NULL,
  `description` text DEFAULT NULL,
  `banner_url` text DEFAULT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotion_products`
--

CREATE TABLE `promotion_products` (
  `promotion_id` int(10) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `extra_discount_pct` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_images`
--

CREATE TABLE `review_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `review_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` text NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_replies`
--

CREATE TABLE `review_replies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `review_id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reply_text` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_categories`
--

CREATE TABLE `room_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `icon_url` text DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_categories`
--

INSERT INTO `room_categories` (`id`, `name`, `slug`, `icon_url`, `display_order`, `is_active`) VALUES
(1, 'Phòng Ngủ', 'phong-ngu', NULL, 1, 1),
(2, 'Phòng Khách', 'phong-khach', NULL, 2, 1),
(3, 'Phòng Ăn', 'phong-an', NULL, 3, 1),
(4, 'Phòng Làm Việc', 'phong-lam-viec', NULL, 4, 1),
(5, 'Tủ Bếp', 'tu-bep', NULL, 5, 1),
(6, 'Nệm', 'nem', NULL, 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `address` text NOT NULL,
  `province` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lng` decimal(10,7) DEFAULT NULL,
  `open_hours` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `phone_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `avatar_url`, `role`, `is_active`, `email_verified`, `phone_verified`, `created_at`, `updated_at`) VALUES
(1, 'Hệ thống Quản trị (Admin)', 'admin@sontd.vn', '0900000001', '$2b$10$1m1.KNt1r6pYCYnigtP9eOQElqmGRd7PdoTjKAqntGtrtT54MWjGC', NULL, 'admin', 1, 0, 0, '2026-03-31 14:00:23', '2026-03-31 14:00:23'),
(2, 'Khách hàng mẫu (User)', 'user@gmail.com', '0912345678', '$2b$10$ubX1OjzSDZRMQwXxnZtLQe15S7/LWMbyF6loOi/vtycgvN33wPVXS', NULL, 'customer', 1, 0, 0, '2026-03-31 14:00:23', '2026-03-31 14:00:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `recipient_name` varchar(150) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `ward` varchar(100) NOT NULL,
  `street_address` text NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `refresh_token` text NOT NULL,
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`device_info`)),
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `refresh_token`, `device_info`, `expires_at`, `created_at`) VALUES
('00b0d1fb-b4ca-466c-b129-e7adf53bff33', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb250ZC52biIsIm5hbWUiOiJI4buHIHRo4buRbmcgUXXhuqNuIHRy4buLIChBZG1pbikiLCJpYXQiOjE3NzQ5NDA2ODAsImV4cCI6MTc3NTU0NTQ4MH0.cOeG5sS_kw9UrPjBiMN1947QaiFbJtpY9zbwr4GhGJE', '{\"device\":\"web\"}', '2026-04-07 14:04:40', '2026-03-31 14:04:40'),
('598c0c38-8dbc-446c-9a20-c4c6cc9f1e0f', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb250ZC52biIsIm5hbWUiOiJI4buHIHRo4buRbmcgUXXhuqNuIHRy4buLIChBZG1pbikiLCJpYXQiOjE3NzQ5NDUwMDUsImV4cCI6MTc3NTU0OTgwNX0.eU7yrkMj3p6Ux3V4wKgbSZ-a0dIy3tLX83x-qJ8Vkjc', '{\"device\":\"web\"}', '2026-04-07 15:16:45', '2026-03-31 15:16:45'),
('e5100118-371f-4cb2-b749-d5abcf7f4478', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb250ZC52biIsIm5hbWUiOiJI4buHIHRo4buRbmcgUXXhuqNuIHRy4buLIChBZG1pbikiLCJpYXQiOjE3NzQ5NDQ1MzEsImV4cCI6MTc3NTU0OTMzMX0.lvAgWQ4AEbC_Ga44AvQl-qmw_hptsJ3aQcd9x5k93P0', '{\"device\":\"web\"}', '2026-04-07 15:08:51', '2026-03-31 15:08:51'),
('faed060a-b892-4e0e-bb98-feebb5504293', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb250ZC52biIsIm5hbWUiOiJI4buHIHRo4buRbmcgUXXhuqNuIHRy4buLIChBZG1pbikiLCJpYXQiOjE3NzQ5NDExNjEsImV4cCI6MTc3NTU0NTk2MX0.XffuDiTCnYqBvnmOH6WW3m2Xhfq_tV0xPfjgTlXjGIY', '{\"device\":\"web\"}', '2026-04-07 14:12:41', '2026-03-31 14:12:41');

-- --------------------------------------------------------

--
-- Table structure for table `variant_attributes`
--

CREATE TABLE `variant_attributes` (
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `attr_value_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_product_prices`
-- (See below for the actual view)
--
CREATE TABLE `v_product_prices` (
`id` bigint(20) unsigned
,`name` varchar(255)
,`base_price` decimal(15,0)
,`discount_pct` smallint(6)
,`sale_price` decimal(22,0)
,`discount_amount` decimal(23,0)
);

-- --------------------------------------------------------

--
-- Structure for view `v_product_prices`
--
DROP TABLE IF EXISTS `v_product_prices`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_product_prices`  AS SELECT `p`.`id` AS `id`, `p`.`name` AS `name`, `p`.`base_price` AS `base_price`, `p`.`discount_pct` AS `discount_pct`, round(`p`.`base_price` * (100 - `p`.`discount_pct`) / 100,0) AS `sale_price`, `p`.`base_price`- round(`p`.`base_price` * (100 - `p`.`discount_pct`) / 100,0) AS `discount_amount` FROM `products` AS `p` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attribute_types`
--
ALTER TABLE `attribute_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_type_value` (`type_id`,`value`);

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_author_user` (`user_id`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_bc_parent` (`parent_id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_bp_author` (`author_id`),
  ADD KEY `idx_blog_posts_category` (`category_id`),
  ADD KEY `idx_blog_posts_status` (`status`),
  ADD KEY `idx_blog_posts_slug` (`slug`(255)),
  ADD KEY `idx_blog_posts_published_at` (`published_at`);

--
-- Indexes for table `blog_post_products`
--
ALTER TABLE `blog_post_products`
  ADD PRIMARY KEY (`post_id`,`product_id`),
  ADD KEY `fk_bpp_product` (`product_id`);

--
-- Indexes for table `blog_post_tags`
--
ALTER TABLE `blog_post_tags`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `fk_bpt_tag` (`tag_id`);

--
-- Indexes for table `blog_tags`
--
ALTER TABLE `blog_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cart_user` (`user_id`),
  ADD KEY `fk_cart_coupon` (`coupon_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cart_variant` (`cart_id`,`variant_id`),
  ADD KEY `fk_ci_variant` (`variant_id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `coupon_codes`
--
ALTER TABLE `coupon_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `fk_order_coupon` (`coupon_id`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_status` (`order_status`),
  ADD KEY `idx_orders_created` (`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_oi_variant` (`variant_id`),
  ADD KEY `idx_order_items_order` (`order_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_osh_order` (`order_id`),
  ADD KEY `fk_osh_user` (`changed_by`);

--
-- Indexes for table `otp_tokens`
--
ALTER TABLE `otp_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_user_purpose` (`user_id`,`purpose`),
  ADD KEY `idx_otp_expires` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku_base` (`sku_base`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_collection` (`collection_id`),
  ADD KEY `idx_products_active` (`is_active`),
  ADD KEY `idx_products_outlet` (`is_outlet`),
  ADD KEY `idx_products_slug` (`slug`(255));

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_cat_room` (`room_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_img_product` (`product_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rev_user` (`user_id`),
  ADD KEY `fk_rev_order_item` (`order_item_id`),
  ADD KEY `idx_reviews_product` (`product_id`),
  ADD KEY `idx_reviews_status` (`status`),
  ADD KEY `idx_reviews_rating` (`product_id`,`rating`);

--
-- Indexes for table `product_specs`
--
ALTER TABLE `product_specs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_spec_product` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_variants_product` (`product_id`),
  ADD KEY `idx_variants_sku` (`sku`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion_products`
--
ALTER TABLE `promotion_products`
  ADD PRIMARY KEY (`promotion_id`,`product_id`),
  ADD KEY `fk_pp_product` (`product_id`);

--
-- Indexes for table `review_images`
--
ALTER TABLE `review_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ri_review` (`review_id`);

--
-- Indexes for table `review_replies`
--
ALTER TABLE `review_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rr_review` (`review_id`),
  ADD KEY `fk_rr_admin` (`admin_user_id`);

--
-- Indexes for table `room_categories`
--
ALTER TABLE `room_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_phone` (`phone`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_addr_user` (`user_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_refresh_token` (`refresh_token`(255)),
  ADD KEY `fk_session_user` (`user_id`);

--
-- Indexes for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD PRIMARY KEY (`variant_id`,`attr_value_id`),
  ADD KEY `fk_va_attrvalue` (`attr_value_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attribute_types`
--
ALTER TABLE `attribute_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_tags`
--
ALTER TABLE `blog_tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `coupon_codes`
--
ALTER TABLE `coupon_codes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_tokens`
--
ALTER TABLE `otp_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_specs`
--
ALTER TABLE `product_specs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_images`
--
ALTER TABLE `review_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_replies`
--
ALTER TABLE `review_replies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_categories`
--
ALTER TABLE `room_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `fk_attrval_type` FOREIGN KEY (`type_id`) REFERENCES `attribute_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `authors`
--
ALTER TABLE `authors`
  ADD CONSTRAINT `fk_author_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD CONSTRAINT `fk_bc_parent` FOREIGN KEY (`parent_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `fk_bp_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_bp_category` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_post_products`
--
ALTER TABLE `blog_post_products`
  ADD CONSTRAINT `fk_bpp_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bpp_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_post_tags`
--
ALTER TABLE `blog_post_tags`
  ADD CONSTRAINT `fk_bpt_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bpt_tag` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupon_codes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ci_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupon_codes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_oi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_osh_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `otp_tokens`
--
ALTER TABLE `otp_tokens`
  ADD CONSTRAINT `fk_otp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_prod_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_prod_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_cat_room` FOREIGN KEY (`room_id`) REFERENCES `room_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_img_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `fk_rev_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rev_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_specs`
--
ALTER TABLE `product_specs`
  ADD CONSTRAINT `fk_spec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promotion_products`
--
ALTER TABLE `promotion_products`
  ADD CONSTRAINT `fk_pp_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pp_promo` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_images`
--
ALTER TABLE `review_images`
  ADD CONSTRAINT `fk_ri_review` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_replies`
--
ALTER TABLE `review_replies`
  ADD CONSTRAINT `fk_rr_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rr_review` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD CONSTRAINT `fk_va_attrvalue` FOREIGN KEY (`attr_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_va_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
