-- Fix RLS policies for patients and appointments tables
-- Allow anonymous users to create bookings via the booking form

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow anonymous insert patients" ON public.patients;
DROP POLICY IF EXISTS "Allow admin full access patients" ON public.patients;
DROP POLICY IF EXISTS "Allow anonymous insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow admin full access appointments" ON public.appointments;

-- Create new working policies for patients table
CREATE POLICY "anon_insert_patients" 
ON public.patients 
FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "admin_all_patients" 
ON public.patients 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create new working policies for appointments table
CREATE POLICY "anon_insert_appointments" 
ON public.appointments 
FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "admin_all_appointments" 
ON public.appointments 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('patients', 'appointments');