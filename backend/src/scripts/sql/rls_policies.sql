-- ========================================
-- Enable RLS
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_items ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to users"
  ON users
  FOR ALL
  USING (auth.role() = 'service_role');

-- ✅ Authenticated users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND id = auth.uid());

-- ✅ Authenticated users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND id = auth.uid());

-- ========================================
-- OTP_SESSIONS TABLE POLICIES
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to otp_sessions"
  ON otp_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- ========================================
-- BOOKINGS TABLE POLICIES
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to bookings"
  ON bookings
  FOR ALL
  USING (auth.role() = 'service_role');

-- ✅ Authenticated users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ✅ Authenticated users can create their own bookings
CREATE POLICY "Users can create own booking"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ✅ Authenticated users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ========================================
-- PACKAGES TABLE POLICIES
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to packages"
  ON packages
  FOR ALL
  USING (auth.role() = 'service_role');

-- ✅ Allow anyone to view active packages
CREATE POLICY "Public can view active packages"
  ON packages
  FOR SELECT
  USING (is_active = true);

-- ========================================
-- PACKAGE_SEGMENTS TABLE POLICIES
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to package_segments"
  ON package_segments
  FOR ALL
  USING (auth.role() = 'service_role');

-- ✅ Allow public read access
CREATE POLICY "Public can view package_segments"
  ON package_segments
  FOR SELECT
  USING (true);

-- ========================================
-- TRIP_SEGMENTS TABLE POLICIES
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to trip_segments"
  ON trip_segments
  FOR ALL
  USING (auth.role() = 'service_role');

-- ✅ Users can view their own trip segments
CREATE POLICY "Users can view own trip segments"
  ON trip_segments
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- DRIVERS TABLE POLICIES (FUTURE USE)
-- ========================================

-- ✅ Backend full access
CREATE POLICY "Allow backend full access to drivers"
  ON drivers
  FOR ALL
  USING (auth.role() = 'service_role');

-- ========================================
-- TEST_ITEMS TABLE POLICIES (TESTING)
-- ========================================

-- ✅ Backend/Admin full access
CREATE POLICY "Allow backend full access to test_items"
  ON test_items
  FOR ALL
  USING (auth.role() = 'service_role');

-- ✅ Authenticated users can view their own test items
CREATE POLICY "Users can view own test_items"
  ON test_items
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ✅ Authenticated users can create test items (must set user_id to their own)
CREATE POLICY "Users can create own test_items"
  ON test_items
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ✅ Authenticated users can update their own test items
CREATE POLICY "Users can update own test_items"
  ON test_items
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ✅ Authenticated users can delete their own test items
CREATE POLICY "Users can delete own test_items"
  ON test_items
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
