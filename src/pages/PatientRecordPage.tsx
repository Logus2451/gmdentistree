import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Calendar, Phone, Mail, User, MapPin, Heart, Shield, Clock, Plus, Printer, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/clinic';
import PatientForm from '../components/PatientForm';
import AppointmentForm from '../components/AppointmentForm';
import MultiPrescriptionForm from '../components/MultiPrescriptionForm';
import TreatmentForm from '../components/TreatmentForm';
import ExaminationTab from '../components/ExaminationTab';
import BillingTab from '../components/BillingTab';
import AdminHeader from '../components/AdminHeader';

interface Patient {
  id: string;
  salutation?: string;
  fullName: string;
  patientCode: string;
  email?: string;
  phone: string;
  age?: number;
  gender?: string;
  aadharCard?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedications?: string;
  dentalHistory?: string;
  preferredDentist?: string;
  lastVisitDate?: string;
  nextCleaningDue?: string;
  createdAt: string;
}

interface Appointment {
  id: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  mealInstruction: string;
  notes?: string;
  prescribedBy?: string;
  prescribedDate: string;
  createdAt: string;
}

interface Treatment {
  id: string;
  treatmentType: string;
  teeth: string[];
  cost: number;
  discount: number;
  totalCost: number;
  notes?: string;
  treatedBy?: string;
  treatmentDate: string;
  status: string;
  createdAt: string;
}

const PatientRecordPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentClinic } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingGroup, setViewingGroup] = useState<any>(null);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [showEditPrescriptionForm, setShowEditPrescriptionForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    if (!currentClinic?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .eq('clinic_id', currentClinic.id)
        .single();

      if (patientError) throw patientError;

      // Fetch patient appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinic_id', currentClinic.id)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Fetch patient prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinic_id', currentClinic.id)
        .order('prescribed_date', { ascending: false });

      if (prescriptionsError) throw prescriptionsError;

      // Fetch patient treatments
      const { data: treatmentsData, error: treatmentsError } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinic_id', currentClinic.id)
        .order('treatment_date', { ascending: false });

      if (treatmentsError) throw treatmentsError;

      // Transform patient data
      const transformedPatient: Patient = {
        id: patientData.id,
        salutation: patientData.salutation || '',
        fullName: patientData.full_name,
        patientCode: patientData.patient_code || '',
        email: patientData.email || '',
        phone: patientData.phone || '',
        age: patientData.age || 0,
        gender: patientData.gender || '',
        aadharCard: patientData.aadhar_card || '',
        address: patientData.address || '',
        dateOfBirth: patientData.date_of_birth || '',
        emergencyContact: patientData.emergency_contact || '',
        insuranceProvider: patientData.insurance_provider || '',
        insurancePolicyNumber: patientData.insurance_policy_number || '',
        allergies: patientData.allergies || '',
        currentMedications: patientData.current_medications || '',
        dentalHistory: patientData.dental_history || '',
        preferredDentist: patientData.preferred_dentist || '',
        lastVisitDate: patientData.last_visit_date || '',
        nextCleaningDue: patientData.next_cleaning_due || '',
        createdAt: patientData.created_at
      };

      const transformedAppointments: Appointment[] = appointmentsData?.map(a => ({
        id: a.id,
        service: a.service,
        appointmentDate: a.appointment_date,
        appointmentTime: a.appointment_time,
        status: a.status,
        notes: a.notes || '',
        createdAt: a.created_at
      })) || [];

      const transformedPrescriptions: Prescription[] = prescriptionsData?.map(p => ({
        id: p.id,
        medicationName: p.medication_name,
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration,
        mealInstruction: p.meal_instruction,
        notes: p.notes || '',
        prescribedBy: p.prescribed_by || '',
        prescribedDate: p.prescribed_date,
        createdAt: p.created_at
      })) || [];

      const transformedTreatments: Treatment[] = treatmentsData?.map(t => ({
        id: t.id,
        treatmentType: t.treatment_type,
        teeth: t.teeth || [],
        cost: t.cost,
        discount: t.discount,
        totalCost: t.total_cost,
        notes: t.notes || '',
        treatedBy: t.treated_by || '',
        treatmentDate: t.treatment_date,
        status: t.status,
        createdAt: t.created_at
      })) || [];

      setPatient(transformedPatient);
      setAppointments(transformedAppointments);
      setPrescriptions(transformedPrescriptions);
      setTreatments(transformedTreatments);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!patient) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.fullName}?\n\nThis will permanently delete:\n- Patient record\n- All appointment history\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patient.id);

      if (error) throw error;
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient. Please try again.');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPrescription = (group: any) => {
    setViewingGroup(group);
    setShowViewModal(true);
  };

  const handleEditPrescription = (group: any) => {
    setEditingGroup(group);
    setShowEditPrescriptionForm(true);
  };

  const handlePrintPrescriptionGroup = (group: {
    prescribedDate: string;
    prescribedBy?: string;
    medications: Prescription[];
  }) => {
    const printContent = `
      <html>
        <head>
          <title>Prescription - ${patient?.patientCode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; line-height: 1.3; font-size: 12px; }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            .clinic-name { font-size: 20px; font-weight: bold; color: #2563eb; margin-bottom: 3px; }
            .clinic-info { margin: 2px 0; color: #666; font-size: 11px; }
            .doctor-info { margin-top: 8px; font-weight: bold; color: #1f2937; font-size: 12px; }
            .prescription-header { background: #f8fafc; padding: 8px; border-radius: 4px; margin: 10px 0; }
            .patient-info { margin: 10px 0; }
            .patient-info div { margin: 3px 0; }
            .rx-symbol { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; }
            .medication { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px; padding: 8px; margin: 6px 0; }
            .med-name { font-size: 14px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
            .med-details { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin: 5px 0; }
            .med-detail { padding: 4px; background: #f9fafb; border-radius: 3px; font-size: 11px; }
            .med-detail strong { color: #374151; }
            .instructions { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 8px; margin: 8px 0; font-size: 11px; }
            .footer { margin-top: 20px; text-align: center; }
            .signature-line { border-top: 1px solid #000; width: 150px; margin: 20px auto 5px; }
            .date-issued { text-align: right; margin-top: 15px; font-size: 10px; color: #666; }
            @media print { body { margin: 0; font-size: 11px; } .header { margin-bottom: 10px; } .medication { margin: 4px 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">${config.name}</div>
            <div class="clinic-info">${config.address}</div>
            <div class="clinic-info">Phone: ${config.phone} | Email: ${config.email}</div>
            <div class="doctor-info">Dr. ${group.prescribedBy || 'Ganeshmoorthy'}</div>
            <div class="clinic-info">BDS, General Dentist</div>
          </div>
          
          <div class="prescription-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="rx-symbol">℞</div>
              <div style="text-align: right;">
                <div><strong>Date:</strong> ${new Date(group.prescribedDate).toLocaleDateString()}</div>
                <div><strong>Prescription ID:</strong> ${group.medications[0].id.slice(0, 8)}</div>
              </div>
            </div>
          </div>

          <div class="patient-info">
            <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Patient Information</h3>
            <div><strong>Name:</strong> ${patient?.fullName}</div>
            <div><strong>Patient ID:</strong> ${patient?.patientCode}</div>
            <div><strong>Age:</strong> ${patient?.age ? `${patient.age} years` : 'N/A'}</div>
            <div><strong>Phone:</strong> ${patient?.phone}</div>
          </div>

          ${group.medications.map(med => `
            <div class="medication">
              <div class="med-name">${med.medicationName}</div>
              <div class="med-details">
                <div class="med-detail">
                  <strong>Dosage:</strong> ${med.dosage}
                </div>
                <div class="med-detail">
                  <strong>Frequency:</strong> ${med.frequency}
                </div>
                <div class="med-detail">
                  <strong>Duration:</strong> ${med.duration}
                </div>
                <div class="med-detail">
                  <strong>Meal:</strong> ${med.mealInstruction}
                </div>
              </div>
            </div>
          `).join('')}
          
          ${group.medications[0]?.notes ? `
            <div class="instructions">
              <h4 style="color: #1f2937; margin: 20px 0 10px 0;">Clinical Notes:</h4>
              ${(() => {
                const notes = group.medications[0].notes;
                const sections = notes.split('\n\n');
                let html = '';
                
                sections.forEach((section, index) => {
                  const lines = section.trim().split('\n');
                  if (lines.length > 0) {
                    const title = index === 0 ? 'Observations' : index === 1 ? 'Investigations' : 'Diagnosis';
                    html += `
                      <div style="margin-bottom: 8px; background: #f9fafb; padding: 6px; border-radius: 3px; border-left: 2px solid #3b82f6;">
                        <h5 style="color: #1f2937; margin: 0 0 4px 0; font-size: 11px; font-weight: 600;">${title}:</h5>
                        <div style="white-space: pre-line; color: #374151; font-size: 10px; line-height: 1.2;">${section.trim()}</div>
                      </div>
                    `;
                  }
                });
                
                return html;
              })()} 
            </div>
          ` : ''}

          <div class="footer">
            <div class="signature-line"></div>
            <div style="margin-top: 10px;"><strong>Doctor's Signature</strong></div>
            <div style="margin-top: 20px; font-size: 12px; color: #666;">
              <p><strong>Important:</strong> Take medication as prescribed. Do not exceed recommended dosage.</p>
              <p>For any queries, contact: ${config.phone}</p>
            </div>
          </div>

          <div class="date-issued">
            Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintPrescription = (prescription: Prescription) => {
    const printContent = `
      <html>
        <head>
          <title>Prescription - ${patient?.patientCode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
            .clinic-name { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
            .clinic-info { margin: 5px 0; color: #666; font-size: 14px; }
            .doctor-info { margin-top: 15px; font-weight: bold; color: #1f2937; }
            .prescription-header { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .patient-info { margin: 20px 0; }
            .patient-info div { margin: 8px 0; }
            .rx-symbol { font-size: 36px; font-weight: bold; color: #2563eb; margin: 20px 0; }
            .medication { background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .med-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .med-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0; }
            .med-detail { padding: 8px; background: #f9fafb; border-radius: 4px; }
            .med-detail strong { color: #374151; }
            .instructions { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
            .footer { margin-top: 40px; text-align: center; }
            .signature-line { border-top: 1px solid #000; width: 200px; margin: 40px auto 10px; }
            .date-issued { text-align: right; margin-top: 30px; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">${config.name}</div>
            <div class="clinic-info">${config.address}</div>
            <div class="clinic-info">Phone: ${config.phone} | Email: ${config.email}</div>
            <div class="doctor-info">Dr. ${prescription.prescribedBy || 'Ganeshmoorthy'}</div>
            <div class="clinic-info">BDS, General Dentist</div>
          </div>
          
          <div class="prescription-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="rx-symbol">℞</div>
              <div style="text-align: right;">
                <div><strong>Date:</strong> ${new Date(prescription.prescribedDate).toLocaleDateString()}</div>
                <div><strong>Prescription ID:</strong> ${prescription.id.slice(0, 8)}</div>
              </div>
            </div>
          </div>

          <div class="patient-info">
            <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Patient Information</h3>
            <div><strong>Name:</strong> ${patient?.fullName}</div>
            <div><strong>Patient ID:</strong> ${patient?.patientCode}</div>
            <div><strong>Age:</strong> ${patient?.age ? `${patient.age} years` : 'N/A'}</div>
            <div><strong>Phone:</strong> ${patient?.phone}</div>
          </div>

          <div class="medication">
            <div class="med-name">${prescription.medicationName}</div>
            <div class="med-details">
              <div class="med-detail">
                <strong>Dosage:</strong> ${prescription.dosage}
              </div>
              <div class="med-detail">
                <strong>Frequency:</strong> ${prescription.frequency}
              </div>
              <div class="med-detail">
                <strong>Duration:</strong> ${prescription.duration}
              </div>
              <div class="med-detail">
                <strong>Meal Instructions:</strong> ${prescription.mealInstruction}
              </div>
            </div>
            ${prescription.notes ? `
              <div class="instructions">
                <strong>Special Instructions:</strong><br>
                ${prescription.notes}
              </div>
            ` : ''}
          </div>

          <div class="footer">
            <div class="signature-line"></div>
            <div style="margin-top: 10px;"><strong>Doctor's Signature</strong></div>
            <div style="margin-top: 20px; font-size: 12px; color: #666;">
              <p><strong>Important:</strong> Take medication as prescribed. Do not exceed recommended dosage.</p>
              <p>For any queries, contact: ${config.phone}</p>
            </div>
          </div>

          <div class="date-issued">
            Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Patient not found</h2>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Patient Info Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.salutation} {patient.fullName}
              </h1>
              <p className="text-gray-600">Patient ID: {patient.patientCode}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap gap-x-8 gap-y-2 px-6">
                {['Profile', 'Examination', 'Treatment', 'Prescription', 'Files', 'Billing', 'Appointments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.toLowerCase()
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-3 gap-4">
                  {/* Basic Information Section */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Full Name</p>
                          <p className="text-sm font-medium">{patient.salutation} {patient.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-medium">{patient.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="text-sm font-medium">{patient.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Age</p>
                        <p className="text-sm font-medium">{patient.age ? `${patient.age} years` : 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Gender</p>
                        <p className="text-sm font-medium">{patient.gender || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Date of Birth</p>
                        <p className="text-sm font-medium">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Aadhar Card</p>
                        <p className="text-sm font-medium">{patient.aadharCard || 'Not provided'}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="text-sm font-medium">{patient.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical & Contact Information */}
                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Medical Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <Heart className="h-4 w-4 text-red-500 mt-1" />
                          <div>
                            <p className="text-xs text-gray-600">Allergies</p>
                            <p className="text-sm font-medium text-red-600">{patient.allergies || 'None reported'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Current Medications</p>
                          <p className="text-sm font-medium">{patient.currentMedications || 'None reported'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Dental History</p>
                          <p className="text-sm font-medium">{patient.dentalHistory || 'No history recorded'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact & Emergency</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Emergency Contact</p>
                          <p className="text-sm font-medium">{patient.emergencyContact || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Preferred Dentist</p>
                          <p className="text-sm font-medium">{patient.preferredDentist || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance & Visit Information */}
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Insurance Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600">Provider</p>
                            <p className="text-sm font-medium">{patient.insuranceProvider || 'Not provided'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Policy Number</p>
                          <p className="text-sm font-medium">{patient.insurancePolicyNumber || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Visit Information</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Last Visit Date</p>
                          <p className="text-sm font-medium">{patient.lastVisitDate ? new Date(patient.lastVisitDate).toLocaleDateString() : 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Next Cleaning Due</p>
                          <p className="text-sm font-medium">{patient.nextCleaningDue ? new Date(patient.nextCleaningDue).toLocaleDateString() : 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'examination' && (
                <ExaminationTab patientId={patient.id} />
              )}

              {activeTab === 'treatment' && (
                <div>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-100 to-teal-200 p-4 rounded-xl shadow-lg mb-6 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-200 p-2 rounded-lg">
                          <User className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Treatment Records</h3>
                          <p className="text-gray-600 text-sm">Patient treatment history</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingTreatment(undefined);
                          setShowTreatmentForm(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-200 text-gray-700 rounded-lg hover:bg-green-300 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Treatment</span>
                      </button>
                    </div>
                  </div>

                  {treatments.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No treatments</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by adding a new treatment.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {treatments.map((treatment, index) => (
                        <motion.div
                          key={treatment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-green-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          {/* Treatment Header */}
                          <div className="bg-gradient-to-r from-green-50 to-teal-100 px-4 py-3 border-b border-green-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="bg-green-200 p-2 rounded-lg">
                                  <User className="h-4 w-4 text-green-700" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">{treatment.treatmentType}</h4>
                                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                                    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
                                      {new Date(treatment.treatmentDate).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      treatment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      treatment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                      treatment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1).replace('_', ' ')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingTreatment(treatment);
                                    setShowTreatmentForm(true);
                                  }}
                                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Delete this treatment?')) {
                                      await supabase.from('treatments').delete().eq('id', treatment.id);
                                      fetchPatientData();
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Treatment Details */}
                          <div className="p-3">
                            <div className="space-y-2">
                              <div className="flex space-x-2">
                                <div className="bg-blue-100 p-2 rounded border border-blue-200 flex-1">
                                  <p className="text-xs text-blue-600 font-medium">Cost</p>
                                  <p className="text-sm font-bold text-blue-800">₹{treatment.cost}</p>
                                </div>
                                <div className="bg-purple-100 p-2 rounded border border-purple-200 flex-1">
                                  <p className="text-xs text-purple-600 font-medium">Total</p>
                                  <p className="text-sm font-bold text-purple-800">₹{treatment.totalCost}</p>
                                </div>
                              </div>
                              
                              {treatment.teeth.length > 0 && (
                                <div className="bg-green-100 p-2 rounded border border-green-200">
                                  <p className="text-xs text-green-600 font-medium mb-1">Teeth</p>
                                  <div className="flex flex-wrap gap-1">
                                    {treatment.teeth.slice(0, 6).map((tooth) => (
                                      <span key={tooth} className="px-1.5 py-0.5 bg-green-200 text-green-800 text-xs rounded">
                                        {tooth}
                                      </span>
                                    ))}
                                    {treatment.teeth.length > 6 && (
                                      <span className="text-xs text-green-600">+{treatment.teeth.length - 6}</span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {treatment.treatedBy && (
                                <div className="bg-amber-100 p-2 rounded border border-amber-200">
                                  <p className="text-xs text-amber-600 font-medium">Treated By</p>
                                  <p className="text-sm font-bold text-amber-800">{treatment.treatedBy}</p>
                                </div>
                              )}
                            </div>
                            
                            {treatment.notes && (
                              <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <p className="text-xs text-yellow-800">
                                  <span className="font-medium">Notes:</span> {treatment.notes.length > 60 ? treatment.notes.substring(0, 60) + '...' : treatment.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'prescription' && (
                <div>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-200 p-4 rounded-xl shadow-lg mb-6 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-200 p-2 rounded-lg">
                          <Plus className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Prescription Records</h3>
                          <p className="text-gray-600 text-sm">Patient medication history</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPrescriptionForm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-200 text-gray-700 rounded-lg hover:bg-blue-300 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Prescription</span>
                      </button>
                    </div>
                  </div>

                  {prescriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <Plus className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new prescription.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        // Group prescriptions by date
                        const grouped = prescriptions.reduce((groups, prescription) => {
                          const key = prescription.prescribedDate;
                          if (!groups[key]) {
                            groups[key] = {
                              prescribedDate: prescription.prescribedDate,
                              prescribedBy: prescription.prescribedBy,
                              medications: []
                            };
                          }
                          groups[key].medications.push(prescription);
                          return groups;
                        }, {} as Record<string, {
                          prescribedDate: string;
                          prescribedBy?: string;
                          medications: Prescription[];
                        }>);
                        
                        return Object.values(grouped).map((group) => (
                          <motion.div
                            key={group.prescribedDate}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-blue-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                          >
                            {/* Prescription Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-3 border-b border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-blue-200 p-2 rounded-lg">
                                    <Plus className="h-4 w-4 text-blue-700" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-800">{new Date(group.prescribedDate).toLocaleDateString()}</h4>
                                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
                                        {group.medications.length} med{group.medications.length > 1 ? 's' : ''}
                                      </span>
                                      {group.prescribedBy && (
                                        <>
                                          <span>•</span>
                                          <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                                            Dr. {group.prescribedBy}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleViewPrescription(group)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="View Full Prescription"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditPrescription(group)}
                                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                                    title="Edit Prescription"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handlePrintPrescriptionGroup(group)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                    title="Print All Medications"
                                  >
                                    <Printer className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Medications Cards */}
                            <div className="p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {group.medications.map((prescription, index) => (
                                  <div key={prescription.id} className="bg-gradient-to-br from-white to-blue-25 rounded-lg p-2 border border-blue-150 hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                                          {index + 1}
                                        </div>
                                        <h5 className="font-bold text-gray-800 text-sm truncate">{prescription.medicationName}</h5>
                                      </div>
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => handleViewPrescription(group)}
                                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                          title="View Full Prescription"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (window.confirm('Delete this medication?')) {
                                              await supabase.from('prescriptions').delete().eq('id', prescription.id);
                                              fetchPatientData();
                                            }
                                          }}
                                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                          title="Delete Medication"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex space-x-2">
                                        <div className="bg-blue-100 p-1 rounded border border-blue-200 flex-1">
                                          <p className="text-xs text-blue-600 font-medium">Dosage</p>
                                          <p className="text-sm font-bold text-blue-800">{prescription.dosage}</p>
                                        </div>
                                        <div className="bg-purple-100 p-1 rounded border border-purple-200 flex-1">
                                          <p className="text-xs text-purple-600 font-medium">Frequency</p>
                                          <p className="text-sm font-bold text-purple-800">{prescription.frequency}</p>
                                        </div>
                                      </div>
                                      <div className="flex space-x-2">
                                        <div className="bg-green-100 p-1 rounded border border-green-200 flex-1">
                                          <p className="text-xs text-green-600 font-medium">Duration</p>
                                          <p className="text-sm font-bold text-green-800">{prescription.duration}</p>
                                        </div>
                                        <div className="bg-amber-100 p-1 rounded border border-amber-200 flex-1">
                                          <p className="text-xs text-amber-600 font-medium">Meal</p>
                                          <p className="text-sm font-bold text-amber-800">{prescription.mealInstruction}</p>
                                        </div>
                                      </div>
                                    </div>
                                    {prescription.notes && (
                                      <div className="mt-2 p-1 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                        <p className="text-xs text-yellow-800">
                                          <span className="font-medium">Notes:</span> {prescription.notes.substring(0, 60)}{prescription.notes.length > 60 ? '...' : ''}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Patient files and documents will be displayed here</p>
                </div>
              )}

              {activeTab === 'billing' && (
                <BillingTab patientId={patient.id} patient={patient} />
              )}

              {activeTab === 'appointments' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Appointment</span>
                    </button>
                  </div>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-gray-500 mt-2">No appointments found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{appointment.service}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p>Time: {appointment.appointmentTime}</p>
                            {appointment.notes && <p>Notes: {appointment.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <PatientForm
          patient={patient}
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={() => {
            setShowEditForm(false);
            fetchPatientData();
          }}
        />
        
        <AppointmentForm
          appointment={{
            patientId: patient.id,
            patientName: `${patient.salutation} ${patient.fullName}`,
            service: '',
            appointmentDate: '',
            appointmentTime: '',
            status: 'scheduled',
            notes: ''
          }}
          isOpen={showAppointmentForm}
          onClose={() => setShowAppointmentForm(false)}
          onSave={() => {
            setShowAppointmentForm(false);
            fetchPatientData();
          }}
        />
        
        <MultiPrescriptionForm
          patientId={patient.id}
          isOpen={showPrescriptionForm}
          onClose={() => setShowPrescriptionForm(false)}
          onSave={() => {
            setShowPrescriptionForm(false);
            fetchPatientData();
          }}
        />
        
        <MultiPrescriptionForm
          patientId={patient.id}
          isOpen={showEditPrescriptionForm}
          editingGroup={editingGroup}
          onClose={() => {
            setShowEditPrescriptionForm(false);
            setEditingGroup(null);
          }}
          onSave={() => {
            setShowEditPrescriptionForm(false);
            setEditingGroup(null);
            fetchPatientData();
          }}
        />
        
        <TreatmentForm
          treatment={editingTreatment}
          patientId={patient.id}
          isOpen={showTreatmentForm}
          onClose={() => {
            setShowTreatmentForm(false);
            setEditingTreatment(undefined);
          }}
          onSave={() => {
            setShowTreatmentForm(false);
            setEditingTreatment(undefined);
            fetchPatientData();
          }}
        />
        
        {/* View Prescription Modal */}
        {showViewModal && viewingGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Prescription Details - {patient.fullName}
                </h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Prescription Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p className="font-semibold">{new Date(viewingGroup.prescribedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Prescribed By:</span>
                      <p className="font-semibold">Dr. {viewingGroup.prescribedBy || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Patient:</span>
                      <p className="font-semibold">{patient.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Medications:</span>
                      <p className="font-semibold">{viewingGroup.medications.length}</p>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medications</h3>
                  <div className="space-y-4">
                    {viewingGroup.medications.map((med: any, index: number) => (
                      <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">{index + 1}. {med.medicationName}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-600 font-medium">Dosage</p>
                            <p className="font-semibold">{med.dosage}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-600 font-medium">Frequency</p>
                            <p className="font-semibold">{med.frequency}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-600 font-medium">Duration</p>
                            <p className="font-semibold">{med.duration}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-600 font-medium">Meal Instructions</p>
                            <p className="font-semibold">{med.mealInstruction}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Notes */}
                {viewingGroup.medications[0]?.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Notes</h3>
                    <div className="space-y-4">
                      {(() => {
                        const notes = viewingGroup.medications[0].notes;
                        const sections = notes.split('\n\n');
                        const titles = ['Observations', 'Investigations', 'Diagnosis'];
                        
                        return sections.map((section, index) => {
                          if (!section.trim()) return null;
                          return (
                            <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                              <h4 className="font-semibold text-gray-900 mb-2">{titles[index] || `Section ${index + 1}`}</h4>
                              <div className="whitespace-pre-line text-sm text-gray-700">
                                {section.trim()}
                              </div>
                            </div>
                          );
                        }).filter(Boolean);
                      })()} 
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4 p-6 border-t">
                <button
                  onClick={() => handlePrintPrescriptionGroup(viewingGroup)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default PatientRecordPage;