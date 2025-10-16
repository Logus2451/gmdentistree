# Create Admin User

To create your first admin user, follow these steps:

## Method 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add user** and create a new user with:

   - Email: `admin@Dentistree.com` (or your preferred email)
   - Password: Create a strong password
   - Email Confirm: `true`

4. Copy the User ID from the created user

5. Go to **SQL Editor** and run this query (replace `USER_ID_HERE` with the actual user ID):

```sql
INSERT INTO public.admin_users (user_id, email, full_name, role, is_active)
VALUES (
  'USER_ID_HERE',
  'admin@Dentistree.com',
  'Admin User',
  'super_admin',
  true
);
```

## Method 2: Using SQL Only

Run this in your Supabase SQL Editor:

```sql
-- Create auth user and admin record in one go
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Insert into auth.users (this is a simplified version)
    -- Note: In production, use the Supabase dashboard or API to create users
    -- This is just for demonstration

    -- For now, create the admin_users record with a placeholder
    -- You'll need to update the user_id after creating the auth user
    INSERT INTO public.admin_users (user_id, email, full_name, role, is_active)
    VALUES (
        gen_random_uuid(), -- Temporary, replace with actual user_id
        'admin@Dentistree.com',
        'Admin User',
        'super_admin',
        true
    );

    RAISE NOTICE 'Admin user record created. Please update user_id with actual auth user ID.';
END $$;
```

## After Creating Admin User

1. Restart your development server: `npm run dev`
2. Go to `http://localhost:5173/admin`
3. You should be redirected to `http://localhost:5173/admin/login`
4. Login with your admin credentials
5. You'll be redirected to the admin dashboard

## Test the Authentication

- Try accessing `/admin` directly - should redirect to login
- Login with admin credentials - should access dashboard
- Login with non-admin user - should show access denied
- Logout - should redirect to login page
