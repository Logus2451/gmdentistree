-- Disable RLS for prescriptions table (temporary fix)
ALTER TABLE public.prescriptions DISABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "prescriptions_policy" ON public.prescriptions;