# Dentistree Admin Portal Guide

This guide provides instructions on how to access and use the Dentistree Admin Portal, along with next steps for making it fully functional.

## 1. Accessing the Admin Portal

The admin portal is a unified interface for managing patients and appointments.

- **URL**: Navigate to `/admin` on the website.
- **Example**: If your site is running at `http://localhost:5173`, the admin portal is at `http://localhost:5173/admin`.

**Note**: Currently, the admin portal is not protected by authentication. This is a critical next step for a production environment.

## 2. Key Features

The admin portal is divided into two main sections: **Appointments Management** and **Patients Management**.

### Dashboard Overview

At the top of the page, you'll find key statistics at a glance:

- **Total Appointments**: The total number of appointments in the system.
- **Total Patients**: The total number of registered patients.
- **Scheduled Today**: A count of appointments with "scheduled" status.
- **This Month**: Total appointments for the current month.

### Appointments Management

This is the default view. Here you can:

- **View All Appointments**: See a list of all appointments with patient name, service, date, time, and status.
- **Search**: Use the search bar to find appointments by patient name or service.
- **Filter by Status**: Use the dropdown menu to filter appointments by their status (`scheduled`, `confirmed`, `cancelled`, `completed`).
- **Update Status**: Change an appointment's status using the dropdown on each appointment card.
- **Delete Appointment**: Remove an appointment by clicking the trash icon.

### Patients Management

Switch to this tab to manage patient records. Here you can:

- **View All Patients**: See a list of all patients with their name, email, and phone number.
- **Search**: Find patients by name or email address.
- **Edit Patient**: The edit button is a placeholder for a future update form.
- **Delete Patient**: Remove a patient and all their associated appointments from the system.

## 3. Important Note: Mock Data

The admin portal is currently populated with **mock (fake) data** for demonstration purposes. The CRUD (Create, Read, Update, Delete) operations you perform will only affect the data in the browser and will reset when you refresh the page.

To make the portal fully functional, you must connect it to your Supabase backend.

## 4. Next Steps & Production Readiness

To take the Dentistree website from a demo to a production-ready application, follow these steps:

### A. Connect to Supabase

1.  **Create a Supabase Project**: If you haven't already, create a new project at [supabase.com](https://supabase.com).
2.  **Run the SQL Script**: In your Supabase project's SQL Editor, run the queries provided in the `supabase_setup.md` file to create the necessary tables.
3.  **Get API Keys**: In your Supabase project settings (under API), find your `Project URL` and `anon` public key.
4.  **Configure Environment Variables**: Update the `.env` file in the root of the project with your keys:
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
5.  **Implement API Calls**:
    - Create a Supabase client utility file (e.g., `src/supabaseClient.ts`).
    - Update `src/pages/BookingPage.tsx` to save new patients and appointments to Supabase.
    - Update `src/pages/AdminPage.tsx` to fetch, update, and delete data from Supabase instead of using mock data.

### B. Secure the Admin Portal

1.  **Set up Supabase Auth**: Implement email/password authentication for your admin users. You can create a separate login page for admins.
2.  **Create Admin Role**: In Supabase, you can manage user roles to distinguish between regular users and admins.
3.  **Update RLS Policies**: Modify the Row-Level Security policies in Supabase (as shown in `supabase_setup.md`) to grant full access only to users with an `admin` role. This is critical for data security.

### C. Integrate Twilio Live Chat

The current chat widget is a simulation. To connect it to Twilio:

1.  **Get Twilio Credentials**: Sign up for Twilio and get your Account SID, Auth Token, and set up a chat service.
2.  **Configure Environment Variables**: Add your Twilio credentials to the `.env` file.
3.  **Implement Twilio SDK**: Update `src/components/TwilioChat.tsx` to use the Twilio SDK for real-time messaging.
