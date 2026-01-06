-- ============================================================
-- USERS TABLE SCHEMA - Complete Reference
-- ============================================================
-- This shows what your users table should look like
-- ============================================================

-- Expected Users Table Structure:
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'USER',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  password_hash TEXT,
  phone VARCHAR(20),
  avatar_url TEXT,
  -- Add other fields as needed
);

-- ============================================================
-- AVAILABLE ROLES
-- ============================================================

/*
USER           - Regular user (customer/client)
ADMIN          - Full system access, can manage users and services
SUPER_ADMIN    - Can do everything including manage other admins
EDITOR         - Limited access to specific services only
*/

-- ============================================================
-- CHECK YOUR ACTUAL TABLE STRUCTURE
-- ============================================================

-- Run this query to see your current schema:
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected output should include these columns:
-- id                | uuid
-- email             | text (NOT NULL)
-- name              | text (NOT NULL)
-- role              | character varying (DEFAULT 'USER')
-- active            | boolean (DEFAULT true)
-- created_at        | timestamp without time zone (DEFAULT now())
-- updated_at        | timestamp without time zone (DEFAULT now())

-- ============================================================
-- IF COLUMNS ARE MISSING, ADD THEM
-- ============================================================

-- Missing 'role' column?
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';

-- Missing 'active' column?
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Missing 'updated_at' column?
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================================
-- SET UP INDEXES (RECOMMENDED)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ============================================================
-- SET UP CONSTRAINTS
-- ============================================================

-- Email should be unique
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- ============================================================
-- EXAMPLE DATA
-- ============================================================

-- Create a super admin
INSERT INTO users (email, name, role, active, created_at, updated_at)
VALUES (
  'bhimpratap08@gmail.com',
  'Bhim Pratap',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET role = 'SUPER_ADMIN', active = true, updated_at = NOW();

-- Create an admin
INSERT INTO users (email, name, role, active, created_at, updated_at)
VALUES (
  'admin@example.com',
  'Admin User',
  'ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create a regular user
INSERT INTO users (email, name, role, active, created_at, updated_at)
VALUES (
  'user@example.com',
  'Regular User',
  'USER',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- QUERY EXAMPLES
-- ============================================================

-- Get all super admins
SELECT * FROM users WHERE role = 'SUPER_ADMIN';

-- Get all active admins
SELECT * FROM users WHERE role IN ('SUPER_ADMIN', 'ADMIN') AND active = true;

-- Get all users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Find user by email
SELECT * FROM users WHERE email = 'bhimpratap08@gmail.com';

-- Update user role
UPDATE users SET role = 'ADMIN', updated_at = NOW() WHERE email = 'user@example.com';

-- Deactivate user
UPDATE users SET active = false, updated_at = NOW() WHERE email = 'user@example.com';

-- Delete user
DELETE FROM users WHERE email = 'user@example.com';

-- ============================================================
-- VERIFY YOUR TABLE IS CORRECT
-- ============================================================

-- Run these checks:

-- 1. Show all columns and their properties
\d users

-- 2. Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- 3. Check for missing data
SELECT email, role, active FROM users WHERE role IS NULL OR active IS NULL;

-- 4. Show bhimpratap08@gmail.com details
SELECT * FROM users WHERE email = 'bhimpratap08@gmail.com';

-- ============================================================
