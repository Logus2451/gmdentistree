import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, Calendar, Users, Phone, Mail, Clock, LogOut, Eye, MessageCircle, MessageSquare, DollarSign, TrendingUp, CreditCard, FileText, UserCheck, Megaphone, BarChart3, Pill, Package, Settings, Stethoscope, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import PatientDetailView from '../components/PatientDetailView';
import AppointmentForm from '../components/AppointmentForm';
import RevenueTab from '../components/RevenueTab';
import ReportsTab from '../components/ReportsTab';
import PrescriptionTab from '../components/PrescriptionTab';
import { sendWhatsAppReminder } from '../services/whatsappService';
import AdminHeader from '../components/AdminHeader';
import ExaminationsPage from './ExaminationsPage';
import TreatmentsPage from './TreatmentsPage';
import SettingsModule from '../components/SettingsModule';

interface Patient {
  id: string;
  salutation?: string;
  fullName: string;
  patientCode: string;
  email?: string;
  phone: string;
  age?: number;
  gender?: string;
  nationality?: string;
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
  patientId: string;
  patientName: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const { currentClinic } = useAuth();
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [viewingPatient, setViewingPatient] = useState<Patient | undefined>(undefined);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  const navigate = useNavigate();
  
  // Fetch data from Supabase
  useEffect(() => {
    if (currentClinic?.id) {
      fetchData();
    }
  }, [currentClinic?.id]);

  const fetchData = async () => {
    if (!currentClinic?.id) return;
    
    try {
      setLoading(true);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Data fetch timeout')), 15000)
      );
      
      // Fetch patients with timeout
      const patientsPromise = supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', currentClinic.id)
        .order('created_at', { ascending: false });
        
      const { data: patientsData, error: patientsError } = await Promise.race([
        patientsPromise,
        timeoutPromise
      ]) as any;

      if (patientsError) throw patientsError;

      // Fetch appointments with patient names
      const appointmentsPromise = supabase
        .from('appointments')
        .select(`
          *,
          patients!inner(full_name)
        `)
        .eq('clinic_id', currentClinic.id)
        .order('created_at', { ascending: false });
        
      const { data: appointmentsData, error: appointmentsError } = await Promise.race([
        appointmentsPromise,
        timeoutPromise
      ]) as any;

      if (appointmentsError) throw appointmentsError;

      // Transform data to match interface
      const transformedPatients: Patient[] = patientsData?.map(p => ({
        id: p.id,
        salutation: p.salutation || '',
        fullName: p.full_name,
        patientCode: p.patient_code || '',
        email: p.email || '',
        phone: p.phone || '',
        age: p.age || 0,
        gender: p.gender || '',
        nationality: p.nationality || '',
        aadharCard: p.aadhar_card || '',
        address: p.address || '',
        dateOfBirth: p.date_of_birth || '',
        emergencyContact: p.emergency_contact || '',
        insuranceProvider: p.insurance_provider || '',
        insurancePolicyNumber: p.insurance_policy_number || '',
        allergies: p.allergies || '',
        currentMedications: p.current_medications || '',
        dentalHistory: p.dental_history || '',
        preferredDentist: p.preferred_dentist || '',
        lastVisitDate: p.last_visit_date || '',
        nextCleaningDue: p.next_cleaning_due || '',
        createdAt: p.created_at
      })) || [];

      const transformedAppointments: Appointment[] = appointmentsData?.map(a => ({
        id: a.id,
        patientId: a.patient_id,
        patientName: a.patients.full_name,
        service: a.service,
        appointmentDate: a.appointment_date,
        appointmentTime: a.appointment_time,
        status: a.status,
        notes: a.notes || '',
        createdAt: a.created_at
      })) || [];

      setPatients(transformedPatients);
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent infinite loading
      setPatients([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (appointmentId: string): Promise<void> => {
    const confirmed = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const deletePatient = async (patientId: string): Promise<void> => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.fullName}?\n\nThis will permanently delete:\n- Patient record\n- All appointment history\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      setPatients(patients.filter(patient => patient.id !== patientId));
      setAppointments(appointments.filter(apt => apt.patientId !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient. Please try again.');
    }
  };

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleAddPatient = (): void => {
    setEditingPatient(undefined);
    setShowPatientForm(true);
  };

  const handleEditPatient = (patient: Patient): void => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleClosePatientForm = (): void => {
    setShowPatientForm(false);
    setEditingPatient(undefined);
  };

  const handleSavePatient = (): void => {
    fetchData(); // Refresh data
  };

  const handleViewPatient = (patient: Patient): void => {
    navigate(`/admin/patient/${patient.id}`);
  };

  const handleClosePatientDetail = (): void => {
    setShowPatientDetail(false);
    setViewingPatient(undefined);
  };

  const handleEditFromDetail = (patient: Patient): void => {
    setShowPatientDetail(false);
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleDeleteFromDetail = async (patientId: string): Promise<void> => {
    await deletePatient(patientId);
    setShowPatientDetail(false);
  };

  const handleAddAppointment = (): void => {
    setEditingAppointment(undefined);
    setShowAppointmentForm(true);
  };

  const handleEditAppointment = (appointment: Appointment): void => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleCloseAppointmentForm = (): void => {
    setShowAppointmentForm(false);
    setEditingAppointment(undefined);
  };

  const handleSaveAppointment = (): void => {
    fetchData(); // Refresh data
  };

  const handleSendWhatsApp = (appointment: Appointment): void => {
    const patient = patients.find(p => p.id === appointment.patientId);
    if (patient) {
      sendWhatsAppReminder(
        {
          fullName: patient.fullName,
          phone: patient.phone
        },
        {
          service: appointment.service,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          status: appointment.status
        }
      );
    }
  };

  const handleSendSMS = (appointment: Appointment): void => {
    const patient = patients.find(p => p.id === appointment.patientId);
    if (patient) {
      const getSMSMessage = (status: string) => {
        const date = new Date(appointment.appointmentDate).toLocaleDateString();
        const time = appointment.appointmentTime;
        const service = appointment.service;
        const name = patient.fullName;
        
        switch (status) {
          case 'scheduled':
            return `Hi ${name}! Your appointment is scheduled at Dr.G.M's Dentistree. Date: ${date}, Time: ${time}, Service: ${service}. Please arrive 15 minutes early. Reply CONFIRM to confirm. Contact: 9952205380`;
          case 'confirmed':
            return `Hi ${name}! Your appointment is CONFIRMED at Dr.G.M's Dentistree. Date: ${date}, Time: ${time}, Service: ${service}. We look forward to seeing you! Please arrive 15 minutes early.`;
          case 'cancelled':
            return `Hi ${name}! Your appointment at Dr.G.M's Dentistree has been cancelled. Date: ${date}, Time: ${time}, Service: ${service}. To reschedule, please contact us: 9952205380`;
          case 'completed':
            return `Hi ${name}! Thank you for visiting Dr.G.M's Dentistree. Service: ${service}, Date: ${date}. How are you feeling? If you have concerns, please contact: 9952205380. Next cleaning due in 6 months.`;
          case 'no_show':
            return `Hi ${name}! We missed you for your appointment at Dr.G.M's Dentistree. Date: ${date}, Time: ${time}, Service: ${service}. To reschedule, please contact: 9952205380`;
          default:
            return `Hi ${name}! Appointment update from Dr.G.M's Dentistree. Date: ${date}, Time: ${time}, Service: ${service}. Contact: 9952205380`;
        }
      };
      
      const message = getSMSMessage(appointment.status);
      const smsUrl = `sms:${patient.phone}?body=${encodeURIComponent(message)}`;
      window.open(smsUrl, '_self');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >


          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded shadow p-3">
              <div className="flex items-center">
                <div className="bg-primary-100 p-1 rounded">
                  <Calendar className="h-3 w-3 text-primary-600" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-600">Appointments</p>
                  <p className="text-lg font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded shadow p-3">
              <div className="flex items-center">
                <div className="bg-green-100 p-1 rounded">
                  <Users className="h-3 w-3 text-green-600" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-600">Patients</p>
                  <p className="text-lg font-bold text-gray-900">{patients.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded shadow p-3">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-1 rounded">
                  <Clock className="h-3 w-3 text-yellow-600" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-600">Today</p>
                  <p className="text-lg font-bold text-gray-900">
                    {appointments.filter(apt => apt.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded shadow p-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1 rounded">
                  <Calendar className="h-3 w-3 text-blue-600" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-600">Month</p>
                  <p className="text-lg font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Grid */}
          {activeModule === 'dashboard' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {[
                { id: 'patients', label: 'Patients', icon: Users, color: 'bg-blue-500' },
                { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'bg-green-500' },
                { id: 'examinations', label: 'Examinations', icon: Stethoscope, color: 'bg-pink-500' },
                { id: 'treatments', label: 'Treatments', icon: User, color: 'bg-cyan-500' },
                { id: 'billing', label: 'Billing', icon: CreditCard, color: 'bg-purple-500' },
                { id: 'accounts', label: 'Accounts', icon: UserCheck, color: 'bg-indigo-500' },
                { id: 'campaign', label: 'Campaign', icon: Megaphone, color: 'bg-orange-500' },
                { id: 'reports', label: 'Reports', icon: BarChart3, color: 'bg-red-500' },
                { id: 'prescription', label: 'Prescription', icon: Pill, color: 'bg-teal-500' },
                { id: 'inventory', label: 'Inventory', icon: Package, color: 'bg-yellow-500' },
                { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' }
              ].map((module) => {
                const IconComponent = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <div className="p-3 text-center">
                      <div className={`${module.color} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{module.label}</h3>
                      <p className="text-xs text-gray-600">Manage {module.label.toLowerCase()}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Module Content */}
          {activeModule !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">{activeModule} Management</h2>
                  <button
                    onClick={() => setActiveModule('dashboard')}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              {(activeModule === 'appointments' || activeModule === 'patients') && (
                <div className="p-3 border-b border-gray-200">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={`Search ${activeModule}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    
                    {activeModule === 'appointments' && (
                      <div className="flex items-center space-x-1">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="all">All Status</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <>
                    {activeModule === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Appointment Records</h3>
                    <button
                      onClick={handleAddAppointment}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Appointment</span>
                    </button>
                  </div>
                  
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                      <p className="mt-1 text-sm text-gray-500">No appointments match your search criteria.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="bg-primary-100 p-2 rounded-full">
                                <Calendar className="h-4 w-4 text-primary-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{appointment.patientName}</h3>
                                <p className="text-xs text-gray-500">{appointment.service}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.appointmentTime}</span>
                            </div>
                            {appointment.notes && (
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-blue-300">
                                <strong>Notes:</strong> {appointment.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <select
                              value={appointment.status}
                              onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                              <option value="no_show">No Show</option>
                            </select>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleSendWhatsApp(appointment)}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleSendSMS(appointment)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  title="SMS"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditAppointment(appointment)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteAppointment(appointment.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

                    {activeModule === 'patients' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Patient Records</h3>
                    <button
                      onClick={handleAddPatient}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="mx-auto h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No patients</h3>
                      <p className="mt-1 text-xs text-gray-500">No patients match your search criteria.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {filteredPatients.map((patient) => (
                        <div key={patient.id} className="bg-white border border-gray-200 rounded p-3 hover:shadow-md transition-shadow relative">
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button 
                              onClick={() => handleViewPatient(patient)}
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleEditPatient(patient)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deletePatient(patient.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="pr-20">
                            <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                              {patient.salutation} {patient.fullName}
                            </h3>
                            <span className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded mb-2 inline-block">
                              {patient.patientCode}
                            </span>
                            
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{patient.phone}</span>
                              </div>
                              {patient.email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{patient.email}</span>
                                </div>
                              )}
                              {patient.age && patient.gender && (
                                <div>{patient.age}y, {patient.gender}</div>
                              )}
                              {patient.allergies && (
                                <div className="text-red-600 truncate">
                                  <strong>Allergies:</strong> {patient.allergies}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

                    {activeModule === 'billing' && (
                      <RevenueTab />
                    )}

                    {activeModule === 'reports' && (
                      <ReportsTab />
                    )}

                    {activeModule === 'prescription' && (
                      <PrescriptionTab />
                    )}

                    {activeModule === 'examinations' && (
                      <ExaminationsPage />
                    )}

                    {activeModule === 'treatments' && (
                      <TreatmentsPage />
                    )}

                    {activeModule === 'settings' && (
                      <SettingsModule />
                    )}

                    {(activeModule === 'accounts' || activeModule === 'campaign' || activeModule === 'inventory') && (
                      <div className="text-center py-12">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                          {activeModule === 'accounts' && <UserCheck className="h-12 w-12 text-gray-400" />}
                          {activeModule === 'campaign' && <Megaphone className="h-12 w-12 text-gray-400" />}
                          {activeModule === 'inventory' && <Package className="h-12 w-12 text-gray-400" />}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">{activeModule} Module</h3>
                        <p className="text-gray-600 mb-4">This module is coming soon. Stay tuned for updates!</p>
                        <button
                          onClick={() => setActiveModule('dashboard')}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
        
        <PatientForm
          patient={editingPatient}
          isOpen={showPatientForm}
          onClose={handleClosePatientForm}
          onSave={handleSavePatient}
        />
        
        {viewingPatient && (
          <PatientDetailView
            patient={viewingPatient}
            isOpen={showPatientDetail}
            onClose={handleClosePatientDetail}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
          />
        )}
        
        <AppointmentForm
          appointment={editingAppointment}
          isOpen={showAppointmentForm}
          onClose={handleCloseAppointmentForm}
          onSave={handleSaveAppointment}
        />
      </div>
      </div>
    </div>
  );
};

export default AdminPage;
