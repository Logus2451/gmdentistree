1. All Tables Structure:
   SELECT
   t.table_name,
   c.column_name,
   c.data_type,
   c.character_maximum_length,
   c.is_nullable,
   c.column_default,
   c.ordinal_position
   FROM information_schema.tables t
   JOIN information_schema.columns c ON t.table_name = c.table_name
   WHERE t.table_schema = 'public'
   AND t.table_type = 'BASE TABLE'
   ORDER BY t.table_name, c.ordinal_position;

2. Foreign Key Relations:
   SELECT
   tc.table_name,
   kcu.column_name,
   ccu.table_name AS foreign_table_name,
   ccu.column_name AS foreign_column_name,
   tc.constraint_name
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
   ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
   JOIN information_schema.constraint_column_usage AS ccu
   ON ccu.constraint_name = tc.constraint_name
   AND ccu.table_schema = tc.table_schema
   WHERE tc.constraint_type = 'FOREIGN KEY'
   AND tc.table_schema = 'public';

3. All Triggers:  
   SELECT
   trigger_name,
   event_manipulation,
   event_object_table,
   action_statement,
   action_timing
   FROM information_schema.triggers
   WHERE trigger_schema = 'public'
   ORDER BY event_object_table, trigger_name;

4. RLS Policies
   SELECT
   schemaname,
   tablename,
   policyname,
   permissive,
   roles,
   cmd,
   qual,
   with_check
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;

5. Functions/Stored Procedures:
SELECT
   routine_name,
   routine_type,
   data_type,
   routine_definition
   FROM information_schema.routines
   WHERE routine_schema = 'public'
   ORDER BY routine_name;

<!-- 1.Output

2.output

3.output

4.output

5.Output -->

1.Output
[
  {
    "table_name": "admin_users",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "admin_users",
    "column_name": "user_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "admin_users",
    "column_name": "email",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "admin_users",
    "column_name": "full_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "admin_users",
    "column_name": "role",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'admin'::text",
    "ordinal_position": 5
  },
  {
    "table_name": "admin_users",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 6
  },
  {
    "table_name": "admin_users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "now()",
    "ordinal_position": 7
  },
  {
    "table_name": "admin_users",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "now()",
    "ordinal_position": 8
  },
  {
    "table_name": "admin_users",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 9
  },
  {
    "table_name": "appointments",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "appointments",
    "column_name": "patient_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "appointments",
    "column_name": "service",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "appointments",
    "column_name": "appointment_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "appointments",
    "column_name": "appointment_time",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "appointments",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "'scheduled'::appointment_status",
    "ordinal_position": 6
  },
  {
    "table_name": "appointments",
    "column_name": "notes",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 7
  },
  {
    "table_name": "appointments",
    "column_name": "duration_minutes",
    "data_type": "integer",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "60",
    "ordinal_position": 8
  },
  {
    "table_name": "appointments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "now()",
    "ordinal_position": 9
  },
  {
    "table_name": "appointments",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "now()",
    "ordinal_position": 10
  },
  {
    "table_name": "appointments",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 11
  },
  {
    "table_name": "clinic_settings",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "clinic_settings",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "clinic_settings",
    "column_name": "currency_symbol",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'₹'::text",
    "ordinal_position": 3
  },
  {
    "table_name": "clinic_settings",
    "column_name": "currency_code",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'INR'::text",
    "ordinal_position": 4
  },
  {
    "table_name": "clinic_settings",
    "column_name": "date_format",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'DD/MM/YYYY'::text",
    "ordinal_position": 5
  },
  {
    "table_name": "clinic_settings",
    "column_name": "time_format",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'12h'::text",
    "ordinal_position": 6
  },
  {
    "table_name": "clinic_settings",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 7
  },
  {
    "table_name": "clinic_settings",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 8
  },
  {
    "table_name": "clinics",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "clinics",
    "column_name": "clinic_code",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "clinics",
    "column_name": "clinic_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "clinics",
    "column_name": "address",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "clinics",
    "column_name": "phone",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "clinics",
    "column_name": "email",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "clinics",
    "column_name": "website",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 7
  },
  {
    "table_name": "clinics",
    "column_name": "logo_url",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 8
  },
  {
    "table_name": "clinics",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 9
  },
  {
    "table_name": "clinics",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 10
  },
  {
    "table_name": "clinics",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 11
  },
  {
    "table_name": "clinics",
    "column_name": "contact_person",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 12
  },
  {
    "table_name": "clinics",
    "column_name": "license_number",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 13
  },
  {
    "table_name": "clinics",
    "column_name": "registration_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "CURRENT_DATE",
    "ordinal_position": 14
  },
  {
    "table_name": "clinics",
    "column_name": "subscription_status",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'trial'::text",
    "ordinal_position": 15
  },
  {
    "table_name": "clinics",
    "column_name": "total_patients",
    "data_type": "integer",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "0",
    "ordinal_position": 16
  },
  {
    "table_name": "clinics",
    "column_name": "last_login_date",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 17
  },
  {
    "table_name": "clinics",
    "column_name": "billing_address",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 18
  },
  {
    "table_name": "clinics",
    "column_name": "tax_id",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 19
  },
  {
    "table_name": "clinics",
    "column_name": "timezone",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'UTC'::text",
    "ordinal_position": 20
  },
  {
    "table_name": "clinics",
    "column_name": "country",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'India'::text",
    "ordinal_position": 21
  },
  {
    "table_name": "clinics",
    "column_name": "state",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 22
  },
  {
    "table_name": "clinics",
    "column_name": "city",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 23
  },
  {
    "table_name": "clinics",
    "column_name": "postal_code",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 24
  },
  {
    "table_name": "clinics",
    "column_name": "hospital_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 25
  },
  {
    "table_name": "examinations",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "examinations",
    "column_name": "patient_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "examinations",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "examinations",
    "column_name": "tooth_number",
    "data_type": "character varying",
    "character_maximum_length": 2,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "examinations",
    "column_name": "examination_type",
    "data_type": "character varying",
    "character_maximum_length": 100,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "examinations",
    "column_name": "findings",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "examinations",
    "column_name": "treatment_required",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "false",
    "ordinal_position": 7
  },
  {
    "table_name": "examinations",
    "column_name": "notes",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 8
  },
  {
    "table_name": "examinations",
    "column_name": "examined_by",
    "data_type": "character varying",
    "character_maximum_length": 100,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 9
  },
  {
    "table_name": "examinations",
    "column_name": "examination_date",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 10
  },
  {
    "table_name": "examinations",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 11
  },
  {
    "table_name": "examinations",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 12
  },
  {
    "table_name": "hospitals",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "hospitals",
    "column_name": "hospital_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "hospitals",
    "column_name": "hospital_code",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "hospitals",
    "column_name": "address",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "hospitals",
    "column_name": "phone",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "hospitals",
    "column_name": "email",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "hospitals",
    "column_name": "contact_person",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 7
  },
  {
    "table_name": "hospitals",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 8
  },
  {
    "table_name": "hospitals",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 9
  },
  {
    "table_name": "hospitals",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 10
  },
  {
    "table_name": "patients",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "patients",
    "column_name": "full_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "patients",
    "column_name": "email",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "patients",
    "column_name": "phone",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "patients",
    "column_name": "address",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "patients",
    "column_name": "date_of_birth",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "patients",
    "column_name": "emergency_contact",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 7
  },
  {
    "table_name": "patients",
    "column_name": "medical_notes",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 8
  },
  {
    "table_name": "patients",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "now()",
    "ordinal_position": 9
  },
  {
    "table_name": "patients",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "now()",
    "ordinal_position": 10
  },
  {
    "table_name": "patients",
    "column_name": "insurance_provider",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 11
  },
  {
    "table_name": "patients",
    "column_name": "insurance_policy_number",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 12
  },
  {
    "table_name": "patients",
    "column_name": "allergies",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 13
  },
  {
    "table_name": "patients",
    "column_name": "current_medications",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 14
  },
  {
    "table_name": "patients",
    "column_name": "dental_history",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 15
  },
  {
    "table_name": "patients",
    "column_name": "preferred_dentist",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 16
  },
  {
    "table_name": "patients",
    "column_name": "last_visit_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 17
  },
  {
    "table_name": "patients",
    "column_name": "next_cleaning_due",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 18
  },
  {
    "table_name": "patients",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 19
  },
  {
    "table_name": "patients",
    "column_name": "salutation",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 20
  },
  {
    "table_name": "patients",
    "column_name": "patient_code",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 21
  },
  {
    "table_name": "patients",
    "column_name": "nationality",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 22
  },
  {
    "table_name": "patients",
    "column_name": "aadhar_card",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 23
  },
  {
    "table_name": "patients",
    "column_name": "gender",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 24
  },
  {
    "table_name": "patients",
    "column_name": "age",
    "data_type": "integer",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 25
  },
  {
    "table_name": "prescriptions",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "prescriptions",
    "column_name": "patient_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "prescriptions",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "prescriptions",
    "column_name": "medication_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "prescriptions",
    "column_name": "dosage",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "prescriptions",
    "column_name": "frequency",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "prescriptions",
    "column_name": "duration",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 7
  },
  {
    "table_name": "prescriptions",
    "column_name": "meal_instruction",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 8
  },
  {
    "table_name": "prescriptions",
    "column_name": "notes",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 9
  },
  {
    "table_name": "prescriptions",
    "column_name": "prescribed_by",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 10
  },
  {
    "table_name": "prescriptions",
    "column_name": "prescribed_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "CURRENT_DATE",
    "ordinal_position": 11
  },
  {
    "table_name": "prescriptions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 12
  },
  {
    "table_name": "prescriptions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 13
  },
  {
    "table_name": "staff",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "staff",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "staff",
    "column_name": "hospital_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "staff",
    "column_name": "name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "staff",
    "column_name": "role",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "staff",
    "column_name": "phone",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "staff",
    "column_name": "email",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 7
  },
  {
    "table_name": "staff",
    "column_name": "can_switch_clinics",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "false",
    "ordinal_position": 8
  },
  {
    "table_name": "staff",
    "column_name": "assigned_clinics",
    "data_type": "ARRAY",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'{}'::uuid[]",
    "ordinal_position": 9
  },
  {
    "table_name": "staff",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 10
  },
  {
    "table_name": "staff",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 11
  },
  {
    "table_name": "staff",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 12
  },
  {
    "table_name": "subscription_templates",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "subscription_templates",
    "column_name": "name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "subscription_templates",
    "column_name": "plan_key",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "subscription_templates",
    "column_name": "monthly_price",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "subscription_templates",
    "column_name": "yearly_price",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "subscription_templates",
    "column_name": "features",
    "data_type": "ARRAY",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "'{}'::text[]",
    "ordinal_position": 6
  },
  {
    "table_name": "subscription_templates",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 7
  },
  {
    "table_name": "subscription_templates",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 8
  },
  {
    "table_name": "subscription_templates",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 9
  },
  {
    "table_name": "subscriptions",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "subscriptions",
    "column_name": "plan_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "subscriptions",
    "column_name": "status",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "'active'::text",
    "ordinal_position": 4
  },
  {
    "table_name": "subscriptions",
    "column_name": "monthly_price",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "subscriptions",
    "column_name": "yearly_price",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 6
  },
  {
    "table_name": "subscriptions",
    "column_name": "billing_cycle",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "'monthly'::text",
    "ordinal_position": 7
  },
  {
    "table_name": "subscriptions",
    "column_name": "start_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "CURRENT_DATE",
    "ordinal_position": 8
  },
  {
    "table_name": "subscriptions",
    "column_name": "end_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 9
  },
  {
    "table_name": "subscriptions",
    "column_name": "auto_renew",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 10
  },
  {
    "table_name": "subscriptions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 11
  },
  {
    "table_name": "subscriptions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 12
  },
  {
    "table_name": "subscriptions",
    "column_name": "hospital_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 13
  },
  {
    "table_name": "super_admins",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "super_admins",
    "column_name": "user_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "super_admins",
    "column_name": "email",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "super_admins",
    "column_name": "full_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "super_admins",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 5
  },
  {
    "table_name": "super_admins",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 6
  },
  {
    "table_name": "super_admins",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 7
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "treatment_name",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "price",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "0",
    "ordinal_position": 4
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "currency",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'₹'::text",
    "ordinal_position": 5
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "is_active",
    "data_type": "boolean",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "true",
    "ordinal_position": 6
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 7
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 8
  },
  {
    "table_name": "treatments",
    "column_name": "id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "ordinal_position": 1
  },
  {
    "table_name": "treatments",
    "column_name": "patient_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 2
  },
  {
    "table_name": "treatments",
    "column_name": "clinic_id",
    "data_type": "uuid",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 3
  },
  {
    "table_name": "treatments",
    "column_name": "treatment_type",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": null,
    "ordinal_position": 4
  },
  {
    "table_name": "treatments",
    "column_name": "teeth",
    "data_type": "ARRAY",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 5
  },
  {
    "table_name": "treatments",
    "column_name": "cost",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "0",
    "ordinal_position": 6
  },
  {
    "table_name": "treatments",
    "column_name": "discount",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "0",
    "ordinal_position": 7
  },
  {
    "table_name": "treatments",
    "column_name": "total_cost",
    "data_type": "numeric",
    "character_maximum_length": null,
    "is_nullable": "NO",
    "column_default": "0",
    "ordinal_position": 8
  },
  {
    "table_name": "treatments",
    "column_name": "notes",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 9
  },
  {
    "table_name": "treatments",
    "column_name": "treated_by",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": null,
    "ordinal_position": 10
  },
  {
    "table_name": "treatments",
    "column_name": "treatment_date",
    "data_type": "date",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "CURRENT_DATE",
    "ordinal_position": 11
  },
  {
    "table_name": "treatments",
    "column_name": "status",
    "data_type": "text",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "'planned'::text",
    "ordinal_position": 12
  },
  {
    "table_name": "treatments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 13
  },
  {
    "table_name": "treatments",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "character_maximum_length": null,
    "is_nullable": "YES",
    "column_default": "now()",
    "ordinal_position": 14
  }
]

2.output
[
  {
    "table_name": "appointments",
    "column_name": "patient_id",
    "foreign_table_name": "patients",
    "foreign_column_name": "id",
    "constraint_name": "appointments_patient_id_fkey"
  },
  {
    "table_name": "patients",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "patients_clinic_id_fkey"
  },
  {
    "table_name": "appointments",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "appointments_clinic_id_fkey"
  },
  {
    "table_name": "admin_users",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "admin_users_clinic_id_fkey"
  },
  {
    "table_name": "prescriptions",
    "column_name": "patient_id",
    "foreign_table_name": "patients",
    "foreign_column_name": "id",
    "constraint_name": "prescriptions_patient_id_fkey"
  },
  {
    "table_name": "treatments",
    "column_name": "patient_id",
    "foreign_table_name": "patients",
    "foreign_column_name": "id",
    "constraint_name": "treatments_patient_id_fkey"
  },
  {
    "table_name": "examinations",
    "column_name": "patient_id",
    "foreign_table_name": "patients",
    "foreign_column_name": "id",
    "constraint_name": "examinations_patient_id_fkey"
  },
  {
    "table_name": "prescriptions",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "prescriptions_clinic_id_fkey"
  },
  {
    "table_name": "treatments",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "treatments_clinic_id_fkey"
  },
  {
    "table_name": "clinics",
    "column_name": "hospital_id",
    "foreign_table_name": "hospitals",
    "foreign_column_name": "id",
    "constraint_name": "clinics_hospital_id_fkey"
  },
  {
    "table_name": "staff",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "staff_clinic_id_fkey"
  },
  {
    "table_name": "staff",
    "column_name": "hospital_id",
    "foreign_table_name": "hospitals",
    "foreign_column_name": "id",
    "constraint_name": "staff_hospital_id_fkey"
  },
  {
    "table_name": "treatment_pricing",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "treatment_pricing_clinic_id_fkey"
  },
  {
    "table_name": "clinic_settings",
    "column_name": "clinic_id",
    "foreign_table_name": "clinics",
    "foreign_column_name": "id",
    "constraint_name": "clinic_settings_clinic_id_fkey"
  },
  {
    "table_name": "subscriptions",
    "column_name": "hospital_id",
    "foreign_table_name": "hospitals",
    "foreign_column_name": "id",
    "constraint_name": "subscriptions_hospital_id_fkey"
  }
]


3.output
[
  {
    "trigger_name": "update_admin_users_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "admin_users",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_appointments_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "appointments",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_clinic_settings_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "clinic_settings",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_clinics_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "clinics",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_hospitals_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "hospitals",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "trigger_generate_patient_code",
    "event_manipulation": "INSERT",
    "event_object_table": "patients",
    "action_statement": "EXECUTE FUNCTION generate_patient_code()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_patients_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "patients",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_staff_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "staff",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  },
  {
    "trigger_name": "update_treatment_pricing_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_table": "treatment_pricing",
    "action_statement": "EXECUTE FUNCTION update_updated_at_column()",
    "action_timing": "BEFORE"
  }
]

4.output
[
  {
    "schemaname": "public",
    "tablename": "admin_users",
    "policyname": "Clinic admin users policy",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(clinic_id = (((current_setting('request.headers'::text, true))::json ->> 'clinic-id'::text))::uuid)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "appointments",
    "policyname": "Clinic appointments policy",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "ALL",
    "qual": "(clinic_id = (((current_setting('request.headers'::text, true))::json ->> 'clinic-id'::text))::uuid)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "clinic_settings",
    "policyname": "Clinic settings access",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(clinic_id = ( SELECT admin_users.clinic_id\n   FROM admin_users\n  WHERE (admin_users.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "clinics",
    "policyname": "Allow read clinic info",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "clinics",
    "policyname": "Super admins can access everything",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM super_admins\n  WHERE ((super_admins.user_id = auth.uid()) AND (super_admins.is_active = true))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "examinations",
    "policyname": "Users can access examinations from their clinic",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(clinic_id = ( SELECT admin_users.clinic_id\n   FROM admin_users\n  WHERE (admin_users.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "patients",
    "policyname": "Clinic patients policy",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "ALL",
    "qual": "(clinic_id = (((current_setting('request.headers'::text, true))::json ->> 'clinic-id'::text))::uuid)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "staff",
    "policyname": "Hospital staff access",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(hospital_id = ( SELECT c.hospital_id\n   FROM (clinics c\n     JOIN admin_users au ON ((c.id = au.clinic_id)))\n  WHERE (au.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "subscription_templates",
    "policyname": "Super admins can manage templates",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM super_admins\n  WHERE ((super_admins.user_id = auth.uid()) AND (super_admins.is_active = true))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "subscriptions",
    "policyname": "Super admins can manage subscriptions",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM super_admins\n  WHERE ((super_admins.user_id = auth.uid()) AND (super_admins.is_active = true))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "treatment_pricing",
    "policyname": "Treatment pricing access",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(clinic_id = ( SELECT admin_users.clinic_id\n   FROM admin_users\n  WHERE (admin_users.user_id = auth.uid())))",
    "with_check": null
  }
]

5.Output
[
  {
    "routine_name": "generate_patient_code",
    "routine_type": "FUNCTION",
    "data_type": "trigger",
    "routine_definition": "\r\nDECLARE\r\n    next_number INTEGER;\r\n    clinic_code TEXT;\r\n    new_code TEXT;\r\nBEGIN\r\n    -- Only generate if patient_code is null\r\n    IF NEW.patient_code IS NULL THEN\r\n        -- Get the clinic code (required)\r\n        SELECT c.clinic_code INTO clinic_code\r\n        FROM clinics c\r\n        WHERE c.id = NEW.clinic_id;\r\n        \r\n        -- Raise error if clinic_code is missing\r\n        IF clinic_code IS NULL THEN\r\n            RAISE EXCEPTION 'clinic_code is required in clinics table for clinic_id: %', NEW.clinic_id;\r\n        END IF;\r\n        \r\n        -- Get the next number for this clinic\r\n        SELECT COALESCE(MAX(\r\n            CASE \r\n                WHEN patient_code ~ ('^' || clinic_code || '[0-9]+$')\r\n                THEN (regexp_replace(patient_code, '^' || clinic_code, ''))::INTEGER\r\n                ELSE 0\r\n            END\r\n        ), 0) + 1\r\n        INTO next_number\r\n        FROM patients \r\n        WHERE clinic_id = NEW.clinic_id \r\n        AND patient_code IS NOT NULL;\r\n        \r\n        -- Generate the new code\r\n        new_code := clinic_code || LPAD(next_number::TEXT, 4, '0');\r\n        \r\n        -- Set the patient code\r\n        NEW.patient_code := new_code;\r\n    END IF;\r\n    \r\n    RETURN NEW;\r\nEND;\r\n"
  },
  {
    "routine_name": "get_patient_stats",
    "routine_type": "FUNCTION",
    "data_type": "record",
    "routine_definition": "\r\nBEGIN\r\n  RETURN QUERY\r\n  SELECT \r\n    (SELECT COUNT(*) FROM public.patients) as total_patients,\r\n    (SELECT COUNT(*) FROM public.appointments) as total_appointments,\r\n    (SELECT COUNT(*) FROM public.appointments \r\n     WHERE appointment_date = CURRENT_DATE AND status = 'scheduled') as scheduled_today,\r\n    (SELECT COUNT(*) FROM public.appointments \r\n     WHERE DATE_TRUNC('month', appointment_date) = DATE_TRUNC('month', CURRENT_DATE)) as appointments_this_month;\r\nEND;\r\n"
  },
  {
    "routine_name": "update_appointment_status",
    "routine_type": "FUNCTION",
    "data_type": "void",
    "routine_definition": "\r\nBEGIN\r\n  UPDATE appointments \r\n  SET status = new_status, updated_at = NOW()\r\n  WHERE id = appointment_id;\r\nEND;\r\n"
  },
  {
    "routine_name": "update_updated_at_column",
    "routine_type": "FUNCTION",
    "data_type": "trigger",
    "routine_definition": "\r\nBEGIN\r\n    NEW.updated_at = NOW();\r\n    RETURN NEW;\r\nEND;\r\n"
  }
]