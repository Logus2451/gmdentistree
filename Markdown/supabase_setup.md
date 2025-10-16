# Dentistree Supabase Setup Guide

Follow these steps to set up your Supabase database for the Dentistree application. Run these SQL commands in the Supabase SQL Editor for your project.

---

### 1. Create `patients` Table

This table stores information about each patient. The `email` field is unique to prevent duplicate patient profiles.

```sql
-- Create the patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (length(full_name) >= 2),
  email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT CHECK (phone IS NULL OR length(phone) >= 10),
  address TEXT,
  date_of_birth DATE,
  emergency_contact TEXT,
  medical_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_patients_email ON public.patients(email);
CREATE INDEX idx_patients_created_at ON public.patients(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.patients IS 'Stores patient profile information with validation.';
```

---

### 2. Create `appointments` Table

This table stores all appointment details. It is linked to the `patients` table via the `patient_id` foreign key.

```sql
-- Create appointment status enum for better data integrity
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show');

-- Create the appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (length(service) >= 3),
  appointment_date DATE NOT NULL CHECK (appointment_date >= CURRENT_DATE),
  appointment_time TEXT NOT NULL,
  status appointment_status DEFAULT 'scheduled' NOT NULL,
  notes TEXT,
  duration_minutes INTEGER DEFAULT 60 CHECK (duration_minutes > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Prevent double booking (same patient, same date/time)
  CONSTRAINT unique_patient_datetime UNIQUE (patient_id, appointment_date, appointment_time)
);

-- Add indexes for performance
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_created_at ON public.appointments(created_at);

-- Add trigger for updated_at
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.appointments IS 'Stores appointment information with business rules.';
```

---

### 3. Create Admin Users Table

This table manages admin users for the admin portal.

```sql
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_admin_user UNIQUE (user_id)
);

-- Add indexes
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.admin_users IS 'Manages admin user access and roles.';
```

---

### 4. Enable Row-Level Security (RLS)

This is a critical step to protect your data from unauthorized access.

```sql
-- Enable RLS for all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

---

### 5. Create RLS Policies

These policies control access to your data based on user authentication and roles.

```sql
-- PATIENTS TABLE POLICIES

-- Allow anonymous users to create new patients (booking form)
CREATE POLICY "Allow anonymous insert patients"
ON public.patients
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow admins full access to patients
CREATE POLICY "Allow admin full access patients"
ON public.patients
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- APPOINTMENTS TABLE POLICIES

-- Allow anonymous users to create new appointments (booking form)
CREATE POLICY "Allow anonymous insert appointments"
ON public.appointments
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow admins full access to appointments
CREATE POLICY "Allow admin full access appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- ADMIN USERS TABLE POLICIES

-- Only super admins can manage admin users
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

-- Allow admins to read their own profile
CREATE POLICY "Allow admin read own profile"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

---

### 6. Create Helper Functions

Useful functions for the application.

```sql
-- Function to get patient with appointment count
CREATE OR REPLACE FUNCTION get_patient_stats()
RETURNS TABLE (
  total_patients BIGINT,
  total_appointments BIGINT,
  scheduled_today BIGINT,
  appointments_this_month BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.patients) as total_patients,
    (SELECT COUNT(*) FROM public.appointments) as total_appointments,
    (SELECT COUNT(*) FROM public.appointments
     WHERE appointment_date = CURRENT_DATE AND status = 'scheduled') as scheduled_today,
    (SELECT COUNT(*) FROM public.appointments
     WHERE DATE_TRUNC('month', appointment_date) = DATE_TRUNC('month', CURRENT_DATE)) as appointments_this_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_patient_stats() TO authenticated;
```

---

### 7. Insert Sample Data (Optional)

Add some sample data for testing.

```sql
-- Insert sample patients (optional for testing)
INSERT INTO public.patients (full_name, email, phone, address) VALUES
('John Doe', 'john.doe@example.com', '(555) 123-4567', '123 Main St, City, State'),
('Jane Smith', 'jane.smith@example.com', '(555) 987-6543', '456 Oak Ave, City, State');

-- Insert sample appointments (optional for testing)
INSERT INTO public.appointments (patient_id, service, appointment_date, appointment_time, status, notes)
SELECT
  p.id,
  'General Checkup & Cleaning',
  CURRENT_DATE + INTERVAL '7 days',
  '10:00 AM',
  'scheduled',
  'First visit'
FROM public.patients p WHERE p.email = 'john.doe@example.com';
```

---

### 8. Next Steps

After running these SQL commands:

1. **Get your Supabase credentials** from Project Settings > API
2. **Create a `.env` file** in your project root:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. **Create your first admin user** by signing up through Supabase Auth, then manually insert into `admin_users` table
4. **Test the connection** by running your application

### Security Notes

- RLS policies ensure data protection
- Email validation prevents invalid emails
- Date constraints prevent past appointments
- Unique constraints prevent duplicate bookings
- Admin role system provides proper access control
