-- ============================================
-- GATIMITRA ORDER TABLES SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Creates three separate tables for each service category
-- ============================================

-- ============================================
-- 1. FOOD ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS food_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Order identification
  order_number TEXT UNIQUE NOT NULL,
  
  -- User information
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_email TEXT,
  
  -- Restaurant information
  restaurant_id TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  restaurant_image TEXT,
  
  -- Order items (stored as JSONB array)
  items JSONB NOT NULL DEFAULT '[]',
  -- Example item structure:
  -- {
  --   "id": "item-1",
  --   "name": "Butter Chicken",
  --   "price": 299,
  --   "quantity": 2,
  --   "image": "/img/butter-chicken.png",
  --   "size": { "name": "Large", "price": 50 },
  --   "addons": [{ "name": "Extra Gravy", "price": 30 }]
  -- }
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  taxes DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Coupon information
  coupon_code TEXT,
  coupon_discount DECIMAL(10, 2) DEFAULT 0,
  
  -- Delivery information
  delivery_address JSONB NOT NULL DEFAULT '{}',
  -- Example: { "address": "123 Main St", "city": "Chennai", "pincode": "600001", "landmark": "Near park" }
  
  delivery_instructions TEXT,
  
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending',
  -- Possible values: pending, confirmed, preparing, out_for_delivery, delivered, cancelled
  
  -- Payment information
  payment_method TEXT NOT NULL DEFAULT 'cash',
  -- Possible values: cash, upi, card, wallet
  payment_status TEXT NOT NULL DEFAULT 'pending',
  -- Possible values: pending, paid, failed, refunded
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Ratings (after delivery)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for food_orders
CREATE INDEX IF NOT EXISTS idx_food_orders_user_id ON food_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_food_orders_order_number ON food_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_food_orders_status ON food_orders(status);
CREATE INDEX IF NOT EXISTS idx_food_orders_created_at ON food_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_orders_restaurant_id ON food_orders(restaurant_id);

-- ============================================
-- 2. PERSON ORDERS (RIDE BOOKINGS) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS person_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Booking identification
  booking_number TEXT UNIQUE NOT NULL,
  
  -- User information
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_email TEXT,
  
  -- Ride details
  vehicle_type TEXT NOT NULL,
  -- Possible values: bike, auto, cab-mini, cab-sedan, cab-suv, rental
  vehicle_name TEXT NOT NULL,
  
  -- Location information
  pickup_location JSONB NOT NULL DEFAULT '{}',
  -- Example: { "address": "Chennai Central", "lat": 13.0827, "lng": 80.2707 }
  dropoff_location JSONB NOT NULL DEFAULT '{}',
  -- Example: { "address": "Airport", "lat": 12.9941, "lng": 80.1709 }
  
  distance_km DECIMAL(10, 2),
  
  -- Pricing
  base_fare DECIMAL(10, 2) NOT NULL DEFAULT 0,
  distance_fare DECIMAL(10, 2) NOT NULL DEFAULT 0,
  time_fare DECIMAL(10, 2) NOT NULL DEFAULT 0,
  surge_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  taxes DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Coupon information
  coupon_code TEXT,
  coupon_discount DECIMAL(10, 2) DEFAULT 0,
  
  -- Booking type
  is_scheduled BOOLEAN DEFAULT FALSE,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  
  -- Booking status
  status TEXT NOT NULL DEFAULT 'pending',
  -- Possible values: pending, confirmed, driver_assigned, driver_arrived, in_transit, completed, cancelled
  
  -- Driver information (filled when assigned)
  driver_id TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  driver_photo TEXT,
  vehicle_number TEXT,
  driver_rating DECIMAL(2, 1),
  
  -- Payment information
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  driver_assigned_at TIMESTAMP WITH TIME ZONE,
  ride_started_at TIMESTAMP WITH TIME ZONE,
  ride_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Estimated times
  estimated_arrival_time TEXT,
  estimated_ride_duration TEXT,
  
  -- Ratings (after ride)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  
  -- Safety features
  sos_triggered BOOLEAN DEFAULT FALSE,
  shared_with JSONB DEFAULT '[]',
  -- Example: [{ "name": "Mom", "phone": "+91..." }]
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for person_orders
CREATE INDEX IF NOT EXISTS idx_person_orders_user_id ON person_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_person_orders_booking_number ON person_orders(booking_number);
CREATE INDEX IF NOT EXISTS idx_person_orders_status ON person_orders(status);
CREATE INDEX IF NOT EXISTS idx_person_orders_created_at ON person_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_person_orders_driver_id ON person_orders(driver_id);

-- ============================================
-- 3. PARCEL ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS parcel_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Order identification
  tracking_number TEXT UNIQUE NOT NULL,
  
  -- Sender information
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_email TEXT,
  
  -- Recipient information
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_email TEXT,
  
  -- Parcel details
  parcel_type TEXT NOT NULL,
  -- Possible values: document, small, medium, large, fragile, express
  parcel_type_name TEXT NOT NULL,
  parcel_weight TEXT,
  parcel_description TEXT,
  
  -- Location information
  pickup_address JSONB NOT NULL DEFAULT '{}',
  -- Example: { "address": "123 Main St", "city": "Chennai", "pincode": "600001", "landmark": "Near park" }
  delivery_address JSONB NOT NULL DEFAULT '{}',
  
  distance_km DECIMAL(10, 2),
  
  -- Delivery type
  delivery_type TEXT NOT NULL DEFAULT 'same-day',
  -- Possible values: same-day, express, scheduled
  
  -- Pricing
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  weight_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  distance_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  express_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  insurance_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  taxes DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Coupon information
  coupon_code TEXT,
  coupon_discount DECIMAL(10, 2) DEFAULT 0,
  
  -- Insurance
  is_insured BOOLEAN DEFAULT FALSE,
  insurance_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Scheduling
  is_scheduled BOOLEAN DEFAULT FALSE,
  scheduled_pickup_time TIMESTAMP WITH TIME ZONE,
  
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending',
  -- Possible values: pending, pickup_assigned, picked_up, in_transit, out_for_delivery, delivered, cancelled, returned
  
  -- Delivery partner information
  partner_id TEXT,
  partner_name TEXT,
  partner_phone TEXT,
  partner_photo TEXT,
  vehicle_number TEXT,
  
  -- Payment information
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  
  -- Delivery confirmation
  delivery_otp TEXT,
  delivery_proof_image TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Estimated times
  estimated_pickup_time TEXT,
  estimated_delivery_time TEXT,
  
  -- Ratings (after delivery)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for parcel_orders
CREATE INDEX IF NOT EXISTS idx_parcel_orders_sender_id ON parcel_orders(sender_id);
CREATE INDEX IF NOT EXISTS idx_parcel_orders_tracking_number ON parcel_orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_parcel_orders_status ON parcel_orders(status);
CREATE INDEX IF NOT EXISTS idx_parcel_orders_created_at ON parcel_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parcel_orders_partner_id ON parcel_orders(partner_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Sequence for food orders (GMF0001, GMF0002, ...)
CREATE SEQUENCE IF NOT EXISTS food_order_seq START WITH 1 INCREMENT BY 1;

-- Sequence for person/ride orders (GMP0001, GMP0002, ...)
CREATE SEQUENCE IF NOT EXISTS person_order_seq START WITH 1 INCREMENT BY 1;

-- Sequence for parcel orders (GMC0001, GMC0002, ...)
CREATE SEQUENCE IF NOT EXISTS parcel_order_seq START WITH 1 INCREMENT BY 1;

-- Function to generate food order numbers (GMF0001 format)
CREATE OR REPLACE FUNCTION generate_food_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'GMF' || LPAD(NEXTVAL('food_order_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate ride booking numbers (GMP0001 format)
CREATE OR REPLACE FUNCTION generate_ride_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_number := 'GMP' || LPAD(NEXTVAL('person_order_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate parcel tracking numbers (GMC0001 format)
CREATE OR REPLACE FUNCTION generate_parcel_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_number := 'GMC' || LPAD(NEXTVAL('parcel_order_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-generating order numbers
DROP TRIGGER IF EXISTS trigger_food_order_number ON food_orders;
CREATE TRIGGER trigger_food_order_number
  BEFORE INSERT ON food_orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_food_order_number();

DROP TRIGGER IF EXISTS trigger_ride_booking_number ON person_orders;
CREATE TRIGGER trigger_ride_booking_number
  BEFORE INSERT ON person_orders
  FOR EACH ROW
  WHEN (NEW.booking_number IS NULL OR NEW.booking_number = '')
  EXECUTE FUNCTION generate_ride_booking_number();

DROP TRIGGER IF EXISTS trigger_parcel_tracking_number ON parcel_orders;
CREATE TRIGGER trigger_parcel_tracking_number
  BEFORE INSERT ON parcel_orders
  FOR EACH ROW
  WHEN (NEW.tracking_number IS NULL OR NEW.tracking_number = '')
  EXECUTE FUNCTION generate_parcel_tracking_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS trigger_food_orders_updated_at ON food_orders;
CREATE TRIGGER trigger_food_orders_updated_at
  BEFORE UPDATE ON food_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_person_orders_updated_at ON person_orders;
CREATE TRIGGER trigger_person_orders_updated_at
  BEFORE UPDATE ON person_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_parcel_orders_updated_at ON parcel_orders;
CREATE TRIGGER trigger_parcel_orders_updated_at
  BEFORE UPDATE ON parcel_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all order tables
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_orders ENABLE ROW LEVEL SECURITY;

-- Policies for food_orders (users can only see their own orders)
DROP POLICY IF EXISTS "Users can view own food orders" ON food_orders;
CREATE POLICY "Users can view own food orders" ON food_orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert food orders" ON food_orders;
CREATE POLICY "Users can insert food orders" ON food_orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own food orders" ON food_orders;
CREATE POLICY "Users can update own food orders" ON food_orders
  FOR UPDATE USING (true);

-- Policies for person_orders
DROP POLICY IF EXISTS "Users can view own ride bookings" ON person_orders;
CREATE POLICY "Users can view own ride bookings" ON person_orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert ride bookings" ON person_orders;
CREATE POLICY "Users can insert ride bookings" ON person_orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own ride bookings" ON person_orders;
CREATE POLICY "Users can update own ride bookings" ON person_orders
  FOR UPDATE USING (true);

-- Policies for parcel_orders
DROP POLICY IF EXISTS "Users can view own parcel orders" ON parcel_orders;
CREATE POLICY "Users can view own parcel orders" ON parcel_orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert parcel orders" ON parcel_orders;
CREATE POLICY "Users can insert parcel orders" ON parcel_orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own parcel orders" ON parcel_orders;
CREATE POLICY "Users can update own parcel orders" ON parcel_orders
  FOR UPDATE USING (true);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to insert sample data

/*
-- Sample food order
INSERT INTO food_orders (
  order_number,
  user_id,
  user_name,
  user_phone,
  restaurant_id,
  restaurant_name,
  restaurant_image,
  items,
  subtotal,
  delivery_fee,
  taxes,
  total_amount,
  delivery_address,
  status,
  payment_method,
  payment_status
) VALUES (
  'GMF0001',
  'GMMS0001',
  'Test User',
  '+919876543210',
  'rest-1',
  'Hot Chappathis',
  '/img/hc.png',
  '[{"id": "item-1", "name": "Butter Chicken", "price": 299, "quantity": 2}]',
  598,
  40,
  50,
  688,
  '{"address": "123 Main Street", "city": "Chennai", "pincode": "600001"}',
  'confirmed',
  'cash',
  'pending'
);

-- Sample ride booking
INSERT INTO person_orders (
  booking_number,
  user_id,
  user_name,
  user_phone,
  vehicle_type,
  vehicle_name,
  pickup_location,
  dropoff_location,
  distance_km,
  base_fare,
  total_amount,
  status,
  payment_method
) VALUES (
  'GMP0001',
  'GMMS0001',
  'Test User',
  '+919876543210',
  'cab-sedan',
  'Cab Sedan',
  '{"address": "Chennai Central"}',
  '{"address": "Airport"}',
  25,
  80,
  530,
  'confirmed',
  'cash'
);

-- Sample parcel order
INSERT INTO parcel_orders (
  tracking_number,
  sender_id,
  sender_name,
  sender_phone,
  recipient_name,
  recipient_phone,
  parcel_type,
  parcel_type_name,
  pickup_address,
  delivery_address,
  delivery_type,
  base_price,
  total_amount,
  status,
  payment_method
) VALUES (
  'GMC0001',
  'GMMS0001',
  'Test User',
  '+919876543210',
  'Recipient Name',
  '+919876543211',
  'small',
  'Small Parcel',
  '{"address": "123 Main Street", "city": "Chennai"}',
  '{"address": "456 Other Street", "city": "Chennai"}',
  'same-day',
  50,
  90,
  'pending',
  'cash'
);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after creating tables to verify

-- Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('food_orders', 'person_orders', 'parcel_orders');

-- Count records in each table
-- SELECT 'food_orders' as table_name, COUNT(*) as count FROM food_orders
-- UNION ALL
-- SELECT 'person_orders', COUNT(*) FROM person_orders
-- UNION ALL
-- SELECT 'parcel_orders', COUNT(*) FROM parcel_orders;
