-- Fix RLS policies for admin_users table
-- The current policies are too restrictive and cause a circular dependency

-- Drop existing policies
DROP POLICY IF EXISTS "Allow super admin manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin read own profile" ON public.admin_users;

-- Create new policies that allow authenticated users to read admin_users
-- This is needed for the authentication check to work

-- Allow authenticated users to read admin_users (needed for auth check)
CREATE POLICY "Allow authenticated read admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Allow super admins to manage admin users
CREATE POLICY "Allow super admin manage admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
  )
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';