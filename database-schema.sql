-- WebShop Database Schema for Neon PostgreSQL
-- Run this SQL directly in your Neon SQL Editor for the rosti-test database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Products table  
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    images TEXT,
    base_price_huf INTEGER NOT NULL,
    on_sale BOOLEAN NOT NULL DEFAULT FALSE,
    sale_price_huf INTEGER,
    discount_threshold INTEGER DEFAULT 5,
    discount_percentage INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    subtotal_huf INTEGER NOT NULL,
    delivery_fee_huf INTEGER NOT NULL,
    total_huf INTEGER NOT NULL,
    delivery_method TEXT DEFAULT 'own-delivery',
    delivery_address TEXT,
    pickup_point_id TEXT,
    barion_payment_id TEXT,
    barion_status TEXT
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price_huf INTEGER NOT NULL,
    discount_applied_huf INTEGER NOT NULL DEFAULT 0
);

-- QR Code Analytics table
CREATE TABLE IF NOT EXISTS qr_code_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    referrer TEXT,
    is_direct_visit BOOLEAN DEFAULT TRUE NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_qr_visits_page ON qr_code_visits(page);
CREATE INDEX IF NOT EXISTS idx_qr_visits_timestamp ON qr_code_visits(timestamp);

-- Insert sample admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password, role) 
VALUES ('admin@webshop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products (optional - remove if you want to start fresh)
INSERT INTO products (sku, name, description, base_price_huf, on_sale, sale_price_huf, image_url) VALUES
('ROSTI-001', 'Klasszikus Rösti', 'Hagyományos svájci rösti burgonyából készítve', 1200, false, null, '/images/product_pictures/Rosti1.jpg'),
('ROSTI-002', 'Fűszeres Rösti', 'Különleges fűszerekkel ízesített rösti', 1350, true, 1200, '/images/product_pictures/Rosti2.jpg'),
('ROSTI-003', 'Zöldséges Rösti', 'Friss zöldségekkel dúsított rösti', 1500, false, null, '/images/product_pictures/Rosti3.jpg'),
('ROSTI-004', 'Sajtos Rösti', 'Olvasztott sajttal készített rösti', 1400, false, null, '/images/product_pictures/Rosti4.jpg'),
('ROSTI-005', 'Bacon Rösti', 'Ropogós baconnel készített rösti', 1600, true, 1450, '/images/product_pictures/Rosti5.jpg'),
('ROSTI-006', 'Gombás Rösti', 'Friss gombákkal készített rösti', 1350, false, null, '/images/product_pictures/Rosti6.jpg'),
('ROSTI-007', 'Mediterrán Rösti', 'Mediterrán fűszerekkel ízesített rösti', 1500, false, null, '/images/product_pictures/Rosti7.jpg'),
('ROSTI-008', 'Prémium Rösti Mix', 'Különleges összetételű prémium rösti', 1800, true, 1600, '/images/product_pictures/Rosti8.jpg')
ON CONFLICT (sku) DO NOTHING;

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
