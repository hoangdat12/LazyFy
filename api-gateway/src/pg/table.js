/**
 * CREATE TABLE "user-service" (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(10) DEFAULT 'inactive',
    roles VARCHAR(10) DEFAULT 'USER',
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
 );


 * CREATE TABLE "key-token" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user-service" (id) UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    refresh_tokens_used TEXT[] DEFAULT ARRAY[]::TEXT[],
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
 );
 */
