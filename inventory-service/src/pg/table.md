CREATE TABLE "inventory-service" (
inven_product_id TEXT UNIQUE NOT NULL PRIMARY KEY,
inven_shop_id INTEGER NOT NULL,
inven_location TEXT DEFAULT 'Unknown',
inven_stock INTEGER DEFAULT 0,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
