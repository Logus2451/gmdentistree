interface Patient {
  fullName: string;
  phone: string;
}

interface Appointment {
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Add India country code if missing
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned; // India country code
  }
  
  return cleaned;
};

import { config } from '../config/clinic';

// ✅ EDIT THESE MESSAGE TEMPLATES AS NEEDED
const MESSAGE_TEMPLATES = {
  scheduled: {
    title: `🦷 *${config.name} Appointment Reminder*`,
    content: `Hello {patientName}!

Your appointment is scheduled:
📅 Date: {date}
⏰ Time: {time}
🔧 Service: {service}

📍 Location: ${config.address}
📞 Contact: ${config.phone}

Please arrive 15 minutes early.
Reply CONFIRM to confirm or RESCHEDULE if needed.

Thank you!
${config.name} Team`
  },
  
  confirmed: {
    title: `✅ *${config.name} Appointment Confirmed*`,
    content: `Hello {patientName}!

Your appointment is CONFIRMED:
📅 Date: {date}
⏰ Time: {time}
🔧 Service: {service}

📍 Location: ${config.address}
📞 Contact: ${config.phone}

We look forward to seeing you!
Please arrive 15 minutes early.

${config.name} Team`
  },
  
  cancelled: {
    title: `❌ *${config.name} Appointment Cancelled*`,
    content: `Hello {patientName}!

Your appointment has been cancelled:
📅 Date: {date}
⏰ Time: {time}
🔧 Service: {service}

To reschedule, please contact us:
📞 ${config.phone}
📧 ${config.email}

We apologize for any inconvenience.

${config.name} Team`
  },
  
  completed: {
    title: `🎉 *Thank You for Visiting ${config.name}*`,
    content: `Hello {patientName}!

Thank you for your recent visit:
📅 Date: {date}
🔧 Service: {service}

How are you feeling? If you have any concerns, please reach out.

📞 Contact: ${config.phone}
💊 Follow post-treatment instructions
🦷 Next cleaning due in 6 months

Thank you for choosing ${config.name}!

${config.name} Team`
  },
  
  no_show: {
    title: `😔 *We Missed You at ${config.name}*`,
    content: `Hello {patientName}!

We missed you for your appointment:
📅 Date: {date}
⏰ Time: {time}
🔧 Service: {service}

To reschedule, please contact us:
📞 ${config.phone}
📧 ${config.email}

We understand things come up. Let's find a new time that works for you.

${config.name} Team`
  }
};

export const sendWhatsAppReminder = (patient: Patient, appointment: Appointment) => {
  const status = appointment.status as keyof typeof MESSAGE_TEMPLATES;
  const template = MESSAGE_TEMPLATES[status] || MESSAGE_TEMPLATES.scheduled;
  
  const message = `${template.title}\n\n${template.content}`
    .replace('{patientName}', patient.fullName)
    .replace('{date}', new Date(appointment.appointmentDate).toLocaleDateString())
    .replace('{time}', appointment.appointmentTime)
    .replace('{service}', appointment.service);

  const phoneNumber = formatPhoneNumber(patient.phone);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const sendWhatsAppFollowUp = (patient: Patient) => {
  const message = `🦷 *${config.name} Follow-up*

Hello ${patient.fullName}!

How are you feeling after your recent dental visit?

If you have any concerns or questions, please don't hesitate to reach out.

📞 Contact: ${config.phone}
📧 Email: ${config.email}

Thank you for choosing ${config.name}!`;

  const phoneNumber = formatPhoneNumber(patient.phone);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};