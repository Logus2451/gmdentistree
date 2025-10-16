-- Create treatments table
CREATE TABLE public.treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  clinic_id TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  teeth TEXT[], -- Array to store multiple tooth numbers
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  treated_by TEXT,
  treatment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Disable RLS for treatments table
ALTER TABLE public.treatments DISABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX idx_treatments_patient_id ON public.treatments(patient_id);
CREATE INDEX idx_treatments_clinic_id ON public.treatments(clinic_id);
CREATE INDEX idx_treatments_treatment_date ON public.treatments(treatment_date);

-- Add comments
COMMENT ON TABLE public.treatments IS 'Patient treatment records';
COMMENT ON COLUMN public.treatments.patient_id IS 'Reference to patient';
COMMENT ON COLUMN public.treatments.clinic_id IS 'Clinic identifier for multi-tenant support';
COMMENT ON COLUMN public.treatments.treatment_type IS 'Type of dental treatment';
COMMENT ON COLUMN public.treatments.teeth IS 'Array of tooth numbers involved in treatment';
COMMENT ON COLUMN public.treatments.cost IS 'Base cost of treatment';
COMMENT ON COLUMN public.treatments.discount IS 'Discount amount';
COMMENT ON COLUMN public.treatments.total_cost IS 'Final cost after discount';
COMMENT ON COLUMN public.treatments.status IS 'Treatment status (planned, in_progress, completed)';
COMMENT ON COLUMN public.treatments.treated_by IS 'Doctor who performed the treatment';