// Clinic Configuration
// This file contains clinic-specific settings that can be customized per deployment

export const clinicConfig = {
  // Basic Info
  name: "Dr.G.M's Dentistree",
  fullName: "Dr.G.M's Dentistree",
  doctorName: "Dr. Ganeshamoorthy",
  specialization: "Restorative dentist and Root canal specialist in Coimbatore",
  tagline: "Biomimetically Preserve Natural teeth, Crafting perfect smile",
  experience: "With over a decade of experience in advanced dental care",

  // Contact Details
  address:
    "No4, vasantham nagar, kappi kadai, near PPG institute of technology, Coimbatore, Tamil Nadu 641035",
  phone: "9952205380",
  email: "dr.gmsdentistree@gmail.com",

  // Branding
  logo: "/images/Logo.jpg",
  primaryColor: "#00FF00",

  // Social Media
  socialMedia: {
    instagram: "https://instagram.com/gnanadental",
    facebook: "https://facebook.com/gnanadental",
    googleMaps: "https://maps.google.com/gnanadental",
  },

  // Services (can be customized per clinic)
  services: [
    "General Checkup & Cleaning",
    "Cosmetic Consultation",
    "Dental Implant Consultation",
    "Emergency Appointment",
    "Teeth Whitening",
    "Orthodontic Consultation",
    "Root Canal Treatment",
    "Periodontal Treatment",
  ],

  // Time Slots (can be customized per clinic)
  timeSlots: [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ],

  // WhatsApp Message Templates
  whatsappTemplates: {
    clinicName: "Dentistree",
    location:
      "No4, vasantham nagar, kappi kadai, near PPG institute of technology, Coimbatore, Tamil Nadu 641035",
    contactPhone: "09952205380",
  },

  // Patient Code Configuration
  patientCodePrefix: "GMS",
};

// Environment-based overrides
const envOverrides = {
  name: import.meta.env.VITE_CLINIC_NAME || clinicConfig.name,
  phone: import.meta.env.VITE_CLINIC_PHONE || clinicConfig.phone,
  email: import.meta.env.VITE_CLINIC_EMAIL || clinicConfig.email,
  address: import.meta.env.VITE_CLINIC_ADDRESS || clinicConfig.address,
};

export const config = {
  ...clinicConfig,
  ...envOverrides,
};
