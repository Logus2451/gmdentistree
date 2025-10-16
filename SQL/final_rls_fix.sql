-- Re-enable RLS and create working policies for admin_users table

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow authenticated read admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow super admin manage admin users" ON public.admin_users;

-- Create simple, working policies

-- Allow all authenticated users to read admin_users (safe for auth checks)
CREATE POLICY "authenticated_read_admin_users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow admins to update/delete their own records
CREATE POLICY "admin_manage_own_record" 
ON public.admin_users 
FOR ALL 
TO authenticated 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Allow super admins to manage all admin records
CREATE POLICY "super_admin_manage_all" 
ON public.admin_users 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin' 
    AND au.is_active = true
  )
);

-- Verify the policies are created
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'admin_users';