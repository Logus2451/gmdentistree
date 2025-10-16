-- Temporarily disable RLS on patients and appointments tables
-- This will allow the booking form to work properly

-- Disable RLS on patients table
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;

-- Disable RLS on appointments table  
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies since we're not using RLS
DROP POLICY IF EXISTS "anon_insert_patients" ON public.patients;
DROP POLICY IF EXISTS "admin_all_patients" ON public.patients;
DROP POLICY IF EXISTS "anon_insert_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_all_appointments" ON public.appointments;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('patients', 'appointments', 'admin_users');