-- Temporarily disable RLS on admin_users table to test
-- This is for debugging - you can re-enable it later

ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';