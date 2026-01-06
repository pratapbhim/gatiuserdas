-- ========================================================
-- PARCEL_ORDERS TABLE SCHEMA UPDATE
-- ========================================================
-- This file contains the SQL commands to add new columns
-- for the enhanced parcel booking features.
-- 
-- Run this in your Supabase SQL editor to update the table.
-- ========================================================

-- ADD NEW COLUMNS TO PARCEL_ORDERS TABLE

-- Declared value for insurance purposes
ALTER TABLE parcel_orders 
ADD COLUMN IF NOT EXISTS declared_value DECIMAL(12, 2) DEFAULT 0;

-- Flag to indicate if invoice was uploaded (for high-value parcels)
ALTER TABLE parcel_orders 
ADD COLUMN IF NOT EXISTS has_invoice BOOLEAN DEFAULT FALSE;

-- Special instructions for pickup/delivery
ALTER TABLE parcel_orders 
ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- ========================================================
-- ADD COLUMN COMMENTS FOR DOCUMENTATION
-- ========================================================

COMMENT ON COLUMN parcel_orders.declared_value IS 'User-declared value of the parcel for insurance purposes';
COMMENT ON COLUMN parcel_orders.has_invoice IS 'Whether an invoice was uploaded for high-value parcels';
COMMENT ON COLUMN parcel_orders.special_instructions IS 'Special instructions for pickup or delivery';

-- ========================================================
-- VERIFICATION QUERY
-- ========================================================
-- Run this to verify the columns were added successfully:
--
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'parcel_orders'
-- AND column_name IN ('declared_value', 'has_invoice', 'special_instructions');
--
-- Expected output:
-- declared_value      | numeric     | YES | 0
-- has_invoice         | boolean     | YES | false
-- special_instructions| text        | YES | NULL
-- ========================================================
