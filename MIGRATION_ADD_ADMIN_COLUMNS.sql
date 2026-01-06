-- ============================================================
-- MIGRATION: Add Admin Management Columns to Users Table
-- ============================================================
-- Run this FIRST to add missing columns to users table
-- ============================================================

-- Step 1: Add 'role' column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';

-- Step 2: Add 'active' column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Step 3: Add 'updated_at' column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Step 4: Update existing rows to have default values
UPDATE users
SET role = 'USER', active = true, updated_at = NOW()
WHERE role IS NULL OR active IS NULL OR updated_at IS NULL;

-- ============================================================
-- VERIFY: Check the table structure
-- ============================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ============================================================
-- CREATE INDEX for faster queries (optional but recommended)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- SUCCESS: If no errors, columns have been added!
-- ============================================================
