Table Structure
-- Run this in Supabase SQL Editor
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('patients', 'appointments', 'admin_users')
ORDER BY table_name, ordinal_position;


[
  {
    "table_name": "admin_users",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "admin_users",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "admin_users",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "admin_users",
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "admin_users",
    "column_name": "role",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'admin'::text"
  },
  {
    "table_name": "admin_users",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "table_name": "admin_users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "admin_users",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "appointments",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "appointments",
    "column_name": "patient_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "appointments",
    "column_name": "service",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "appointments",
    "column_name": "appointment_date",
    "data_type": "date",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "appointments",
    "column_name": "appointment_time",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "appointments",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'scheduled'::appointment_status"
  },
  {
    "table_name": "appointments",
    "column_name": "notes",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "appointments",
    "column_name": "duration_minutes",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "60"
  },
  {
    "table_name": "appointments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "appointments",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "patients",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "patients",
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "date_of_birth",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "emergency_contact",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "medical_notes",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "patients",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "patients",
    "column_name": "insurance_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "insurance_policy_number",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "allergies",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "current_medications",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "dental_history",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "preferred_dentist",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "last_visit_date",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "patients",
    "column_name": "next_cleaning_due",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null
  }
]




RLS Policies
-- Run this to see existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

No Data


Current Constranits

-- Check foreign keys and constraints
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('patients', 'appointments', 'admin_users');


[
  {
    "table_name": "patients",
    "constraint_name": "patients_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_name": "patients",
    "foreign_column_name": "id"
  },
  {
    "table_name": "patients",
    "constraint_name": "patients_email_key",
    "constraint_type": "UNIQUE",
    "column_name": "email",
    "foreign_table_name": "patients",
    "foreign_column_name": "email"
  },
  {
    "table_name": "appointments",
    "constraint_name": "appointments_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_name": "appointments",
    "foreign_column_name": "id"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "patient_id",
    "foreign_table_name": "appointments",
    "foreign_column_name": "appointment_date"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "patient_id",
    "foreign_table_name": "appointments",
    "foreign_column_name": "appointment_time"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "patient_id",
    "foreign_table_name": "appointments",
    "foreign_column_name": "patient_id"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "appointment_date",
    "foreign_table_name": "appointments",
    "foreign_column_name": "appointment_date"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "appointment_date",
    "foreign_table_name": "appointments",
    "foreign_column_name": "appointment_time"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "appointment_date",
    "foreign_table_name": "appointments",
    "foreign_column_name": "patient_id"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "appointment_time",
    "foreign_table_name": "appointments",
    "foreign_column_name": "appointment_date"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "appointment_time",
    "foreign_table_name": "appointments",
    "foreign_column_name": "appointment_time"
  },
  {
    "table_name": "appointments",
    "constraint_name": "unique_patient_datetime",
    "constraint_type": "UNIQUE",
    "column_name": "appointment_time",
    "foreign_table_name": "appointments",
    "foreign_column_name": "patient_id"
  },
  {
    "table_name": "appointments",
    "constraint_name": "appointments_patient_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "patient_id",
    "foreign_table_name": "patients",
    "foreign_column_name": "id"
  },
  {
    "table_name": "admin_users",
    "constraint_name": "admin_users_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_name": "admin_users",
    "foreign_column_name": "id"
  },
  {
    "table_name": "admin_users",
    "constraint_name": "unique_admin_user",
    "constraint_type": "UNIQUE",
    "column_name": "user_id",
    "foreign_table_name": "admin_users",
    "foreign_column_name": "user_id"
  },
  {
    "table_name": "admin_users",
    "constraint_name": "admin_users_user_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "user_id",
    "foreign_table_name": null,
    "foreign_column_name": null
  }
]