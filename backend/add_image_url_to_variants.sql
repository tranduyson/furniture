-- Migration: Thêm cột image_url vào bảng product_variants
-- Chạy lệnh này trong MySQL client (Workbench, HeidiSQL, hoặc terminal)

ALTER TABLE product_variants 
ADD COLUMN image_url VARCHAR(500) NULL AFTER is_active;
