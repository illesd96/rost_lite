-- WebShop Database Cleanup Script for Local Development
-- This script will clean all data from your database while preserving the structure
-- Run this script to get a fresh, clean database for local development

-- Disable foreign key checks temporarily to avoid constraint issues
SET session_replication_role = replica;

-- Clear all data from tables (in correct order to respect foreign keys)
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE user_addresses CASCADE;
TRUNCATE TABLE qr_code_visits CASCADE;
TRUNCATE TABLE delivery_settings CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE users CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset sequences for auto-generated IDs (if any exist)
-- Note: UUID fields don't use sequences, but this is here for completeness

-- Insert default admin user for local development
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password, role) 
VALUES ('admin@webshop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default delivery settings
INSERT INTO delivery_settings (delivery_days, weeks_in_advance, cutoff_hours, is_active)
VALUES ('["monday","wednesday"]', 4, 24, true);

-- Optional: Insert sample products for testing (uncomment if needed)
/*
INSERT INTO products (sku, name, description, base_price_huf, on_sale, sale_price_huf, image_url) VALUES
('ROSTI-001', 'Klasszikus Rösti', 'Hagyományos svájci rösti burgonyából készítve', 1200, false, null, '/images/product_pictures/Rosti1.jpg'),
('ROSTI-002', 'Fűszeres Rösti', 'Különleges fűszerekkel ízesített rösti', 1350, true, 1200, '/images/product_pictures/Rosti2.jpg'),
('ROSTI-003', 'Zöldséges Rösti', 'Friss zöldségekkel dúsított rösti', 1500, false, null, '/images/product_pictures/Rosti3.jpg'),
('ROSTI-004', 'Sajtos Rösti', 'Olvasztott sajttal készített rösti', 1400, false, null, '/images/product_pictures/Rosti4.jpg'),
('ROSTI-005', 'Bacon Rösti', 'Ropogós baconnel készített rösti', 1600, true, 1450, '/images/product_pictures/Rosti5.jpg'),
('ROSTI-006', 'Gombás Rösti', 'Friss gombákkal készített rösti', 1350, false, null, '/images/product_pictures/Rosti6.jpg'),
('ROSTI-007', 'Mediterrán Rösti', 'Mediterrán fűszerekkel ízesített rösti', 1500, false, null, '/images/product_pictures/Rosti7.jpg'),
('ROSTI-008', 'Prémium Rösti Mix', 'Különleges összetételű prémium rösti', 1800, true, 1600, '/images/product_pictures/Rosti8.jpg');
*/

-- Verify the cleanup was successful
SELECT 'Database cleanup completed successfully!' as status;

-- Show table counts to verify they're clean (except for the admin user and delivery settings)
SELECT 
    'users' as table_name, 
    COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
    'user_addresses' as table_name, 
    COUNT(*) as record_count 
FROM user_addresses
UNION ALL
SELECT 
    'products' as table_name, 
    COUNT(*) as record_count 
FROM products
UNION ALL
SELECT 
    'orders' as table_name, 
    COUNT(*) as record_count 
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name, 
    COUNT(*) as record_count 
FROM order_items
UNION ALL
SELECT 
    'qr_code_visits' as table_name, 
    COUNT(*) as record_count 
FROM qr_code_visits
UNION ALL
SELECT 
    'delivery_settings' as table_name, 
    COUNT(*) as record_count 
FROM delivery_settings
ORDER BY table_name;
