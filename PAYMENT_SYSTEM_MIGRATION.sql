-- ============================================================
-- PAYMENT SYSTEM MIGRATION - Add Payment Fields to Orders
-- ============================================================
-- Run this in Supabase SQL Editor to add payment columns
-- ============================================================

-- Add payment columns to food_orders table
ALTER TABLE food_orders
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Add payment columns to person_orders table
ALTER TABLE person_orders
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Add payment columns to parcel_orders table
ALTER TABLE parcel_orders
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- ============================================================
-- Create indexes for faster queries
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_food_orders_payment_status ON food_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_food_orders_razorpay_payment_id ON food_orders(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_person_orders_payment_status ON person_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_person_orders_razorpay_payment_id ON person_orders(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_parcel_orders_payment_status ON parcel_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_parcel_orders_razorpay_payment_id ON parcel_orders(razorpay_payment_id);

-- ============================================================
-- Verify columns were added
-- ============================================================

-- Check food_orders columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'food_orders' 
AND column_name IN ('payment_status', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id', 'paid_at');

-- Check person_orders columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'person_orders' 
AND column_name IN ('payment_status', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id', 'paid_at');

-- Check parcel_orders columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'parcel_orders' 
AND column_name IN ('payment_status', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id', 'paid_at');

-- ============================================================
-- SAMPLE QUERIES FOR TESTING
-- ============================================================

-- Get all pending payments for food orders
SELECT id, total_amount, payment_status FROM food_orders WHERE payment_status = 'pending';

-- Get all completed payments
SELECT id, total_amount, payment_status, paid_at FROM food_orders WHERE payment_status = 'paid';

-- Get payment statistics
SELECT 
  payment_status,
  COUNT(*) as count,
  SUM(total_amount) as total_amount
FROM food_orders
GROUP BY payment_status;

-- ============================================================
