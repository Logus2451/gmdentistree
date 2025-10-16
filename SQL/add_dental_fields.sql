-- Add dental-specific fields to patients table
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS insurance_provider TEXT,
ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS current_medications TEXT,
ADD COLUMN IF NOT EXISTS dental_history TEXT,
ADD COLUMN IF NOT EXISTS preferred_dentist TEXT,
ADD COLUMN IF NOT EXISTS last_visit_date DATE,
ADD COLUMN IF NOT EXISTS next_cleaning_due DATE;

-- Add comment for new fields
COMMENT ON COLUMN public.patients.insurance_provider IS 'Patient insurance provider name';
COMMENT ON COLUMN public.patients.insurance_policy_number IS 'Insurance policy number';
COMMENT ON COLUMN public.patients.allergies IS 'Known allergies';
COMMENT ON COLUMN public.patients.current_medications IS 'Current medications';
COMMENT ON COLUMN public.patients.dental_history IS 'Previous dental procedures and history';
COMMENT ON COLUMN public.patients.preferred_dentist IS 'Preferred dentist name';
COMMENT ON COLUMN public.patients.last_visit_date IS 'Date of last dental visit';
COMMENT ON COLUMN public.patients.next_cleaning_due IS 'Next cleaning appointment due date';