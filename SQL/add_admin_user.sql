-- Add the logged-in user as an admin
-- Replace the user_id with the actual user ID from the error message

INSERT INTO public.admin_users (user_id, email, full_name, role, is_active)
VALUES (
  'db5e33d7-1850-4aef-8b7f-8b4f9197f23f',
  'your-email@example.com', -- Replace with the actual email you used to sign up
  'Admin User',
  'super_admin',
  true
);

-- Verify the admin user was created
SELECT * FROM public.admin_users WHERE user_id = 'db5e33d7-1850-4aef-8b7f-8b4f9197f23f';