/\*\*

- CREATE TABLE "users" (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(150) NOT NULL,
  lastName VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  status VARCHAR(10) DEFAULT 'inactive',
  roles VARCHAR(10) DEFAULT 'USER',
  isActive BOOLEAN DEFAULT true,
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  );

- CREATE TABLE "key-token" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "users" (id) UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  private_key TEXT NOT NULL,
  refresh_tokens_used TEXT[] DEFAULT ARRAY[]::TEXT[],
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  );

- CREATE TABLE "otp-token" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  token TEXT,
  secret TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (email) REFERENCES "users" (email)
  );

- CREATE TABLE address (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20),
  default_address BOOLEAN DEFAULT false,
  country VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES "users" (id)
  );

\*/
