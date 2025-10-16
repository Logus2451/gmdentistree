import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: string;
  full_name: string;
  email: string;
}

interface Appointment {
  id?: string;
  patientId: string;
  patientName?: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, isOpen, onClose, onSave }) => {
  const { currentClinic } = useAuth();
  const [formData, setFormData] = useState<Appointment>({
    patientId: '',
    service: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'scheduled',
    notes: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'General Checkup & Cleaning',
    'Cosmetic Consultation',
    'Dental Implant Consultation',
    'Emergency Appointment',
    'Teeth Whitening',
    'Orthodontic Consultation',
    'Root Canal Treatment',
    'Periodontal Treatment'
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      if (appointment) {
        setFormData(appointment);
      } else {
        setFormData({
          patientId: '',
          service: '',
          appointmentDate: '',
          appointmentTime: '',
          status: 'scheduled',
          notes: ''
        });
      }
    }
  }, [isOpen, appointment]);

  const fetchPatients = async () => {
    if (!currentClinic?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, email')
        .eq('clinic_id', currentClinic.id)
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinic?.id) {
      setError('No clinic selected');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        patient_id: formData.patientId,
        service: formData.service,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        status: formData.status,
        notes: formData.notes || null,
        clinic_id: currentClinic.id
      };

      if (appointment?.id) {
        // Update existing appointment
        const { error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', appointment.id);
        
        if (error) throw error;
      } else {
        // Create new appointment
        const { error } = await supabase
          .from('appointments')
          .insert(appointmentData);
        
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {appointment ? 'Edit Appointment' : 'Add New Appointment'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name} ({patient.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
            <select
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <select
                required
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional notes or instructions"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Appointment'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AppointmentForm;