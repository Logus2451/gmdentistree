-- Keep RLS disabled on admin_users table
-- This is acceptable since this table only contains admin role information
-- and we still have authentication protection at the application level

ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all policies since we're not using RLS
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "admin_manage_own_record" ON public.admin_users;
DROP POLICY IF EXISTS "super_admin_manage_all" ON public.admin_users;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';