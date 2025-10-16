import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Trash2, Calendar, Clock, User, Phone, Mail, MapPin, Shield, AlertTriangle, Pill, FileText, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendWhatsAppFollowUp } from '../services/whatsappService';

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
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

interface PatientDetailViewProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ 
  patient, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patient.id) {
      fetchAppointments();
    }
  }, [isOpen, patient.id]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patient.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      // Transform data to match interface
      const transformedAppointments = data?.map(apt => ({
        id: apt.id,
        service: apt.service,
        appointmentDate: apt.appointment_date,
        appointmentTime: apt.appointment_time,
        status: apt.status,
        notes: apt.notes,
        createdAt: apt.created_at
      })) || [];
      
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${patient.fullName}? This will also delete all their appointments.`)) {
      onDelete(patient.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-6 border-b bg-gradient-to-r from-primary-50 to-teal-50 gap-3 sm:gap-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.fullName}</h2>
            <p className="text-gray-600">Patient ID: {patient.id.slice(0, 8)}...</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => sendWhatsAppFollowUp({ fullName: patient.fullName, phone: patient.phone })}
                className="p-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                title="Send WhatsApp Message"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <button
                onClick={() => onEdit(patient)}
                className="p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                title="Edit Patient"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                title="Delete Patient"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Patient Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{patient.phone}</span>
                </div>
                {patient.dateOfBirth && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-gray-900">{patient.address}</span>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="text-gray-900">{patient.emergencyContact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insurance Info */}
            {(patient.insuranceProvider || patient.insurancePolicyNumber) && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Insurance Information
                </h3>
                <div className="space-y-2">
                  {patient.insuranceProvider && (
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="text-gray-900">{patient.insuranceProvider}</p>
                    </div>
                  )}
                  {patient.insurancePolicyNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Policy Number</p>
                      <p className="text-gray-900">{patient.insurancePolicyNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical Info */}
            {(patient.allergies || patient.currentMedications) && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Medical Information
                </h3>
                <div className="space-y-3">
                  {patient.allergies && (
                    <div>
                      <p className="text-sm font-medium text-red-700">Allergies</p>
                      <p className="text-gray-900">{patient.allergies}</p>
                    </div>
                  )}
                  {patient.currentMedications && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 flex items-center">
                        <Pill className="h-4 w-4 mr-1" />
                        Current Medications
                      </p>
                      <p className="text-gray-900">{patient.currentMedications}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dental Info */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Dental Information
              </h3>
              <div className="space-y-3">
                {patient.preferredDentist && (
                  <div>
                    <p className="text-sm text-gray-500">Preferred Dentist</p>
                    <p className="text-gray-900">{patient.preferredDentist}</p>
                  </div>
                )}
                {patient.lastVisitDate && (
                  <div>
                    <p className="text-sm text-gray-500">Last Visit</p>
                    <p className="text-gray-900">{new Date(patient.lastVisitDate).toLocaleDateString()}</p>
                  </div>
                )}
                {patient.nextCleaningDue && (
                  <div>
                    <p className="text-sm text-gray-500">Next Cleaning Due</p>
                    <p className="text-gray-900">{new Date(patient.nextCleaningDue).toLocaleDateString()}</p>
                  </div>
                )}
                {patient.dentalHistory && (
                  <div>
                    <p className="text-sm text-gray-500">Dental History</p>
                    <p className="text-gray-900">{patient.dentalHistory}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointments History */}
          <div>
            <div className="bg-white border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointment History ({appointments.length})
                </h3>
              </div>
              
              <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No appointments found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{appointment.service}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {appointment.appointmentDate ? 
                                new Date(appointment.appointmentDate + 'T00:00:00').toLocaleDateString() : 
                                'No date'
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointmentTime || 'No time'}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Booked: {appointment.createdAt ? 
                            new Date(appointment.createdAt).toLocaleDateString() : 
                            'Unknown'
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t bg-gray-50 text-center text-xs sm:text-sm text-gray-500">
          Patient since: {new Date(patient.createdAt).toLocaleDateString()}
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetailView;