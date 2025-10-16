# Multi-Tenant Dental SaaS Setup Guide

This guide explains how to deploy the same codebase for multiple dental clinics with complete data isolation.

## 🏥 **Architecture Overview**

- **Single Supabase Backend** - All clinics share the same database
- **Multiple Frontend Deployments** - Each clinic gets their own website
- **Complete Data Isolation** - RLS policies ensure clinics only see their data
- **Customizable Branding** - Each clinic can have their own colors, info, etc.

## 📋 **Prerequisites**

1. Supabase project with multi-tenant migration completed
2. Clinic record created in `clinics` table
3. Admin user created and linked to clinic

## 🚀 **Deploying for a New Clinic**

### **Step 1: Get Clinic Information**

From your Supabase `clinics` table, get:
- `id` (UUID)
- `clinic_code` (e.g., 'SMITH_DENTAL')

### **Step 2: Environment Variables**

Create `.env` file for the new clinic:

```env
# Supabase Configuration (Same for all clinics)
VITE_SUPABASE_URL=https://hdetupsfslynqkjgahlq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Multi-Tenant Configuration (Unique per clinic)
VITE_CLINIC_ID=clinic-uuid-from-database
VITE_CLINIC_CODE=SMITH_DENTAL

# Optional: Clinic Customization
VITE_CLINIC_NAME=Smith Dental Clinic
VITE_CLINIC_PHONE=+91-9876543210
VITE_CLINIC_EMAIL=contact@smithdental.com
VITE_CLINIC_ADDRESS=123 Main Street, Chennai, Tamil Nadu, India
```

### **Step 3: Customize Clinic Configuration**

Edit `src/config/clinic.ts` for clinic-specific settings:

```typescript
export const clinicConfig = {
  name: 'Smith Dental',
  fullName: 'Smith Dental Clinic',
  address: '123 Main Street, Chennai, Tamil Nadu, India',
  phone: '+91-9876543210',
  email: 'contact@smithdental.com',
  
  // Customize services, time slots, social media, etc.
  services: [
    'General Checkup & Cleaning',
    'Orthodontics',
    'Cosmetic Dentistry',
    // Add clinic-specific services
  ],
  
  socialMedia: {
    instagram: 'https://instagram.com/smithdental',
    facebook: 'https://facebook.com/smithdental',
    googleMaps: 'https://maps.google.com/smithdental'
  }
};
```

### **Step 4: Deploy**

Deploy to your preferred platform:

#### **Netlify:**
```bash
npm run build
# Deploy dist folder to Netlify
# Set environment variables in Netlify dashboard
```

#### **Vercel:**
```bash
npm run build
# Deploy to Vercel
# Set environment variables in Vercel dashboard
```

#### **Custom Domain:**
- Point domain to deployment (e.g., `smithdental.com`)
- Or use subdomain (e.g., `smith.yourdentalsaas.com`)

## 🔐 **Security Features**

### **Automatic Data Isolation:**
- Each clinic only sees their patients/appointments
- RLS policies enforce separation at database level
- Admin users can only access their clinic's data

### **Authentication:**
- Each clinic has separate admin login
- No cross-clinic access possible
- Secure JWT-based authentication

## 📊 **What Each Clinic Gets**

### **Frontend Features:**
- ✅ Custom branding (name, colors, contact info)
- ✅ Patient booking system
- ✅ Admin dashboard for managing patients/appointments
- ✅ WhatsApp integration with clinic-specific messages
- ✅ Responsive design for mobile/desktop

### **Backend Features:**
- ✅ Complete data isolation
- ✅ Secure multi-tenant architecture
- ✅ Scalable to unlimited clinics
- ✅ Shared infrastructure costs

## 🛠 **Adding a New Clinic**

### **Database Setup:**
```sql
-- 1. Insert new clinic
INSERT INTO public.clinics (clinic_code, clinic_name, address, phone, email) 
VALUES ('NEW_CLINIC', 'New Dental Clinic', 'Address', 'Phone', 'Email');

-- 2. Create admin user (after Supabase Auth signup)
INSERT INTO public.admin_users (user_id, email, full_name, clinic_id, role)
VALUES ('auth-user-id', 'admin@newclinic.com', 'Admin Name', 'clinic-id', 'super_admin');
```

### **Frontend Deployment:**
1. Clone the codebase
2. Update `.env` with new clinic details
3. Customize `src/config/clinic.ts`
4. Deploy to new domain/subdomain
5. Test booking and admin functionality

## 🔄 **Maintenance**

### **Code Updates:**
- Update main codebase
- Deploy to all clinic websites
- Each clinic maintains their data isolation

### **Adding Features:**
- New features automatically available to all clinics
- Clinic-specific customizations via config files

## 💰 **Cost Structure**

### **Shared Costs:**
- Single Supabase instance
- Shared development/maintenance

### **Per-Clinic Costs:**
- Domain/hosting (minimal)
- Custom branding (one-time)

This architecture allows you to scale to hundreds of dental clinics while maintaining complete data security and customization!