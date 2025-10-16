-- Create examinations table
CREATE TABLE IF NOT EXISTS examinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL,
    tooth_number VARCHAR(2) NOT NULL,
    examination_type VARCHAR(100) NOT NULL,
    findings TEXT,
    treatment_required BOOLEAN DEFAULT FALSE,
    notes TEXT,
    examined_by VARCHAR(100),
    examination_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_examinations_patient_id ON examinations(patient_id);
CREATE INDEX IF NOT EXISTS idx_examinations_clinic_id ON examinations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_examinations_tooth_number ON examinations(tooth_number);
CREATE INDEX IF NOT EXISTS idx_examinations_date ON examinations(examination_date);

-- Add RLS (Row Level Security) - disabled for admin functionality
ALTER TABLE examinations DISABLE ROW LEVEL SECURITY;