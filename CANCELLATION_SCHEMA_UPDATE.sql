-- ============================================
-- GATIMITRA CANCELLATION SCHEMA UPDATE
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Adds cancellation-related columns to all order tables
-- ============================================

-- ============================================
-- 1. ADD CANCELLATION COLUMNS TO FOOD_ORDERS
-- ============================================
ALTER TABLE food_orders 
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_percentage DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'not_applicable';
-- refund_status: not_applicable, pending, processed, failed

-- ============================================
-- 2. ADD CANCELLATION COLUMNS TO PERSON_ORDERS
-- ============================================
ALTER TABLE person_orders 
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_percentage DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'not_applicable';

-- ============================================
-- 3. ADD CANCELLATION COLUMNS TO PARCEL_ORDERS
-- ============================================
ALTER TABLE parcel_orders 
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_percentage DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'not_applicable';

-- ============================================
-- 4. CREATE INDEXES FOR CANCELLED ORDERS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_food_orders_cancelled ON food_orders(status) WHERE status = 'cancelled';
CREATE INDEX IF NOT EXISTS idx_person_orders_cancelled ON person_orders(status) WHERE status = 'cancelled';
CREATE INDEX IF NOT EXISTS idx_parcel_orders_cancelled ON parcel_orders(status) WHERE status = 'cancelled';

-- ============================================
-- 5. COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON COLUMN food_orders.cancel_reason IS 'Reason provided by user for cancellation';
COMMENT ON COLUMN food_orders.refund_percentage IS 'Percentage of refund (0, 50, or 100)';
COMMENT ON COLUMN food_orders.refund_amount IS 'Actual refund amount in INR';
COMMENT ON COLUMN food_orders.cancelled_at IS 'Timestamp when order was cancelled';
COMMENT ON COLUMN food_orders.refund_status IS 'Status of refund: not_applicable, pending, processed, failed';

COMMENT ON COLUMN person_orders.cancel_reason IS 'Reason provided by user for cancellation';
COMMENT ON COLUMN person_orders.refund_percentage IS 'Percentage of refund (0, 50, or 100)';
COMMENT ON COLUMN person_orders.refund_amount IS 'Actual refund amount in INR';
COMMENT ON COLUMN person_orders.cancelled_at IS 'Timestamp when order was cancelled';
COMMENT ON COLUMN person_orders.refund_status IS 'Status of refund: not_applicable, pending, processed, failed';

COMMENT ON COLUMN parcel_orders.cancel_reason IS 'Reason provided by user for cancellation';
COMMENT ON COLUMN parcel_orders.refund_percentage IS 'Percentage of refund (0, 50, or 100)';
COMMENT ON COLUMN parcel_orders.refund_amount IS 'Actual refund amount in INR';
COMMENT ON COLUMN parcel_orders.cancelled_at IS 'Timestamp when order was cancelled';
COMMENT ON COLUMN parcel_orders.refund_status IS 'Status of refund: not_applicable, pending, processed, failed';

-- ============================================
-- REFUND PERCENTAGE LOGIC (Reference):
-- ============================================
-- FULL REFUND (100%):
--   - pending
-- 
-- PARTIAL REFUND (50%):
--   - confirmed
--   - preparing (food)
--   - driver_assigned (person)
--   - pickup_assigned (parcel)
--   - picked_up (parcel)
--   - accepted
-- 
-- NO REFUND (0%):
--   - out_for_delivery
--   - in_transit
--   - driver_arrived
--   - delivered
--   - completed
-- ============================================
