CREATE TABLE shop (
id SERIAL PRIMARY KEY,
shop_owner VARCHAR(30) NOT NULL,
shop_name VARCHAR(150) NOT NULL,
shop_total_product INTEGER DEFAULT 0,
shop_folowers BIGINT DEFAULT 0,
shop_following BIGINT DEFAULT 0,
shop_evaluate BIGINT DEFAULT 0,
createdAt TIMESTAMP DEFAULT NOW(),
updatedAt TIMESTAMP DEFAULT NOW()
);
