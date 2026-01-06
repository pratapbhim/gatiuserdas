-- ============================================================
-- MAKE bhimpratap08@gmail.com PERMANENT SUPER_ADMIN
-- ============================================================
-- IMPORTANT: Run MIGRATION_ADD_ADMIN_COLUMNS.sql FIRST!
-- Then come back and run the commands below
-- ============================================================

-- STEP 0: Make sure you ran the migration first!
-- If you got "column role does not exist" error, run:
-- MIGRATION_ADD_ADMIN_COLUMNS.sql
-- Then come back here.

-- ============================================================

-- Method 1: If user already exists in database (SAFEST)
-- This will update bhimpratap08@gmail.com to SUPER_ADMIN if they exist
UPDATE users 
SET role = 'SUPER_ADMIN', active = true, updated_at = NOW()
WHERE email = 'bhimpratap08@gmail.com';

-- ============================================================

-- Method 2: If user doesn't exist, create new SUPER_ADMIN
-- Only run this if Method 1 didn't find the user
INSERT INTO users (id, email, name, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'bhimpratap08@gmail.com',
  'Bhim Pratap',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
);

-- If you get error "duplicate key value violates unique constraint"
-- It means the email already exists - just run Method 1 above instead

-- ============================================================

-- Verify it worked - run this to check:
SELECT email, name, role, active, created_at 
FROM users 
WHERE email = 'bhimpratap08@gmail.com';

-- Expected output:
-- email: bhimpratap08@gmail.com
-- name: Bhim Pratap
-- role: SUPER_ADMIN
-- active: true
-- created_at: (current timestamp)

-- ============================================================

-- To see all admins including the new one:
SELECT email, name, role, active, created_at 
FROM users 
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
ORDER BY created_at DESC;

-- ============================================================
