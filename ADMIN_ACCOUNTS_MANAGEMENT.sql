-- ====================================================
-- ADMIN ACCOUNTS MANAGEMENT SQL GUIDE
-- ====================================================
-- This file contains SQL queries for managing admin accounts
-- Use these in Supabase SQL Editor

-- ====================================================
-- 1. VIEW ALL ADMINS
-- ====================================================
SELECT 
  id,
  email,
  name,
  role,
  active,
  created_at,
  updated_at
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
ORDER BY created_at DESC;

-- ====================================================
-- 2. CREATE PERMANENT ADMIN (bhimpratap08@gmail.com)
-- ====================================================
INSERT INTO users (id, email, name, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'bhimpratap08@gmail.com',
  'Bhim Pratap',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- If admin already exists, update to SUPER_ADMIN role:
UPDATE users
SET role = 'SUPER_ADMIN', active = true, updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- ====================================================
-- 3. CREATE NEW ADMIN
-- ====================================================
-- Replace email, name with actual values
INSERT INTO users (id, email, name, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin Name',
  'ADMIN',
  true,
  NOW(),
  NOW()
);

-- ====================================================
-- 4. UPDATE ADMIN ROLE
-- ====================================================
UPDATE users
SET role = 'ADMIN', updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- Change role to SUPER_ADMIN:
UPDATE users
SET role = 'SUPER_ADMIN', updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- ====================================================
-- 5. DEACTIVATE ADMIN (make inactive)
-- ====================================================
UPDATE users
SET active = false, updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- ====================================================
-- 6. ACTIVATE ADMIN (make active)
-- ====================================================
UPDATE users
SET active = true, updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- ====================================================
-- 7. DELETE ADMIN
-- ====================================================
-- WARNING: This deletes the admin permanently
DELETE FROM users
WHERE email = 'admin@example.com' AND role != 'SUPER_ADMIN';

-- ====================================================
-- 8. FIND ADMIN BY EMAIL
-- ====================================================
SELECT * FROM users
WHERE email = 'bhimpratap08@gmail.com';

-- ====================================================
-- 9. COUNT ADMINS BY ROLE
-- ====================================================
SELECT 
  role,
  COUNT(*) as count
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
GROUP BY role;

-- ====================================================
-- 10. FIND INACTIVE ADMINS
-- ====================================================
SELECT id, email, name, role, active, created_at
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
AND active = false
ORDER BY created_at DESC;

-- ====================================================
-- 11. MAKE ADMIN SUPER_ADMIN (PROMOTE)
-- ====================================================
UPDATE users
SET role = 'SUPER_ADMIN', updated_at = NOW()
WHERE id = 'user-id-here';

-- ====================================================
-- 12. MAKE SUPER_ADMIN TO ADMIN (DEMOTE)
-- ====================================================
-- Only if there's another SUPER_ADMIN:
UPDATE users
SET role = 'ADMIN', updated_at = NOW()
WHERE id = 'user-id-here' 
AND (SELECT COUNT(*) FROM users WHERE role = 'SUPER_ADMIN') > 1;

-- ====================================================
-- 13. GET ADMIN STATS
-- ====================================================
SELECT 
  COUNT(*) as total_admins,
  SUM(CASE WHEN role = 'SUPER_ADMIN' THEN 1 ELSE 0 END) as super_admins,
  SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END) as admins,
  SUM(CASE WHEN role = 'EDITOR' THEN 1 ELSE 0 END) as editors,
  SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active_admins
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- ====================================================
-- 14. SEARCH ADMINS BY NAME OR EMAIL
-- ====================================================
SELECT id, email, name, role, active, created_at
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
AND (email ILIKE '%search%' OR name ILIKE '%search%')
ORDER BY created_at DESC;

-- ====================================================
-- 15. UPDATE ADMIN DETAILS (NAME + ROLE)
-- ====================================================
UPDATE users
SET 
  name = 'New Name',
  role = 'ADMIN',
  updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- ====================================================
-- QUICK COMMANDS
-- ====================================================

-- Make bhimpratap08@gmail.com permanent SUPER_ADMIN:
UPDATE users SET role = 'SUPER_ADMIN', active = true WHERE email = 'bhimpratap08@gmail.com';

-- Create new admin:
INSERT INTO users (id, email, name, role, active, created_at, updated_at)
VALUES (gen_random_uuid(), 'email@domain.com', 'Full Name', 'ADMIN', true, NOW(), NOW());

-- Delete admin (only ADMIN or EDITOR, not SUPER_ADMIN):
DELETE FROM users WHERE email = 'email@domain.com' AND role IN ('ADMIN', 'EDITOR');

-- Get all admins with count:
SELECT email, name, role, active FROM users WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR') ORDER BY created_at DESC;

-- ====================================================
-- NOTES FOR DEVELOPERS
-- ====================================================
/*
ROLES AVAILABLE:
- SUPER_ADMIN: Full system access, can manage everything including other admins
- ADMIN: Full access to users, orders, and services
- EDITOR: Limited access to specific services only

IMPORTANT:
1. Always keep at least 1 SUPER_ADMIN in the system
2. Use ON CONFLICT (email) DO NOTHING to prevent duplicate email errors
3. Use gen_random_uuid() to generate unique IDs
4. Always update the updated_at timestamp when making changes
5. active column: true = active, false = inactive/blocked

PERMANENT ADMIN:
- bhimpratap08@gmail.com should be set as SUPER_ADMIN
- Use the UPDATE query to set or update this admin
*/
