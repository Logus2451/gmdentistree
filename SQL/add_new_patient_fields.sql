-- Add new patient fields to patients table
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS salutation TEXT,
ADD COLUMN IF NOT EXISTS patient_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS aadhar_card TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER;

-- Make email optional by removing NOT NULL constraint
ALTER TABLE public.patients ALTER COLUMN email DROP NOT NULL;

-- Add comments for new fields
COMMENT ON COLUMN public.patients.salutation IS 'Patient salutation (Mr, Mrs, Ms, Dr)';
COMMENT ON COLUMN public.patients.patient_code IS 'Unique patient identification code';
COMMENT ON COLUMN public.patients.aadhar_card IS 'Aadhar card number';
COMMENT ON COLUMN public.patients.gender IS 'Patient gender';
COMMENT ON COLUMN public.patients.age IS 'Patient age in years';