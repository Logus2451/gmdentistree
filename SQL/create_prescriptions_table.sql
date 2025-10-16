-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  clinic_id TEXT NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  meal_instruction TEXT NOT NULL,
  notes TEXT,
  prescribed_by TEXT,
  prescribed_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy for prescriptions
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for prescriptions (if RLS is enabled)
CREATE POLICY "prescriptions_policy" ON public.prescriptions
  FOR ALL USING (clinic_id = current_setting('app.clinic_id', true));

-- Add indexes for better performance
CREATE INDEX idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX idx_prescriptions_clinic_id ON public.prescriptions(clinic_id);
CREATE INDEX idx_prescriptions_prescribed_date ON public.prescriptions(prescribed_date);

-- Add comments
COMMENT ON TABLE public.prescriptions IS 'Patient prescription records';
COMMENT ON COLUMN public.prescriptions.patient_id IS 'Reference to patient';
COMMENT ON COLUMN public.prescriptions.clinic_id IS 'Clinic identifier for multi-tenant support';
COMMENT ON COLUMN public.prescriptions.medication_name IS 'Name of prescribed medication';
COMMENT ON COLUMN public.prescriptions.dosage IS 'Medication dosage (e.g., 100mg, 1ml)';
COMMENT ON COLUMN public.prescriptions.frequency IS 'Frequency per day (e.g., 1-1-1)';
COMMENT ON COLUMN public.prescriptions.duration IS 'Treatment duration (e.g., 5 days, 1 week)';
COMMENT ON COLUMN public.prescriptions.meal_instruction IS 'Before/After meal instruction';
COMMENT ON COLUMN public.prescriptions.prescribed_by IS 'Doctor who prescribed the medication';
COMMENT ON COLUMN public.prescriptions.prescribed_date IS 'Date when prescription was given';