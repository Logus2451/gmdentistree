import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2, Search, UserPlus, Pill } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { config } from '../config/clinic';
import { useAuth } from '../contexts/AuthContext';

interface Medication {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  mealInstruction: string;
}

interface Patient {
  id: string;
  fullName: string;
  phone: string;
}

interface QuickPatient {
  fullName: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: string;
}

interface MultiPrescriptionFormProps {
  patientId?: string;
  prescribedDate?: string;
  editingGroup?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const MultiPrescriptionForm: React.FC<MultiPrescriptionFormProps> = ({ 
  patientId, 
  prescribedDate, 
  editingGroup,
  isOpen, 
  onClose, 
  onSave 
}) => {
  const { currentClinic } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || '');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showQuickPatientForm, setShowQuickPatientForm] = useState(false);
  const [quickPatient, setQuickPatient] = useState<QuickPatient>({
    fullName: '',
    phone: '',
    email: '',
    age: undefined,
    gender: ''
  });
  const [medications, setMedications] = useState<Medication[]>([{
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    mealInstruction: ''
  }]);
  const [prescribedBy, setPrescribedBy] = useState('');
  const [observations, setObservations] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [createAppointment, setCreateAppointment] = useState(false);
  const [date, setDate] = useState(prescribedDate || new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    // Don't reset selectedPatientId if we're editing or have a patientId
    if (!editingGroup && !patientId) {
      setSelectedPatientId('');
      setSelectedPatient(null);
      setSearchTerm('');
    }
    setShowPatientDropdown(false);
    setMedications([{
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      mealInstruction: ''
    }]);
    setPrescribedBy('');
    setObservations('');
    setInvestigations('');
    setDiagnosis('');
    setFollowUpDate('');
    setCreateAppointment(false);
    setDate(prescribedDate || new Date().toISOString().split('T')[0]);
    setError('');
  };

  const medicationOptions = [
    'Paracetamol', 'Tab. Decdan', 'Tab. Brufen', 'Stolin Gum Astringent', 'Tab. Neurobion Forte',
    'Tab. Pyrigesic', 'Syr. Ibugesic', 'Emoform Toothpaste', 'Cap. Wymox', 'Gumex',
    'Karvol inhalations', 'Tab. Metrogyl', 'Cap. Mox', 'Syr. Mox', 'G - 32 Gum Paint',
    'Orex-Lo', 'Tab. Crocin', 'Sensodent KF Toothpaste', 'Tab. Paracetamol', 'Tab. Voveran',
    'Tab. E-Mycin', 'Anabel', 'Cap. Proxyvon', 'Clohex Mouthwash', 'Dologel',
    'Cream Clobetesol', 'Tab. Neurobion', 'Cap. Spasmo-Proxyvon', 'Tab. Diclomol', 'Tab. Doxy-1',
    'Tab. Ciplox', 'Otrivin Nasal Drops', 'Tab. Sumo'
  ];

  const dosages = ['100mg', '1ml', '200mg', '2ml', '500mg', '5ml'];
  const frequencies = ['0-0-1', '0-1-0', '0-1-1', '1-0-1', '1-1-0', '1-1-1', '1-0-0'];
  const durations = ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '1 week', '2 weeks', '1 month'];
  const mealInstructions = ['After meal', 'Before meal'];

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    } else if (!editingGroup && !patientId) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && patients.length > 0) {
      if (editingGroup) {
        // Load existing prescription data for editing
        setSelectedPatientId(editingGroup.patientId || patientId || '');
        setDate(editingGroup.prescribedDate);
        setPrescribedBy(editingGroup.prescribedBy || '');
        
        // Parse notes back into separate fields
        if (editingGroup.medications[0]?.notes) {
          const sections = editingGroup.medications[0].notes.split('\n\n');
          setObservations(sections[0] || '');
          setInvestigations(sections[1] || '');
          setDiagnosis(sections[2] || '');
        } else {
          setObservations('');
          setInvestigations('');
          setDiagnosis('');
        }
        
        // Load medications
        const meds = editingGroup.medications.map((med: any) => ({
          medicationName: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          mealInstruction: med.mealInstruction
        }));
        setMedications(meds);
        
        // Find and set patient
        const patient = patients.find(p => p.id === editingGroup.patientId);
        if (patient) {
          setSelectedPatient(patient);
          setSearchTerm(`${patient.fullName} - ${patient.phone}`);
        }
      } else if (patientId) {
        setSelectedPatientId(patientId);
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
          setSelectedPatient(patient);
          setSearchTerm(`${patient.fullName} - ${patient.phone}`);
        }
      }
    }
  }, [isOpen, patients, editingGroup, patientId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(patient => 
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients([]);
    }
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, phone')
        .eq('clinic_id', currentClinic?.id)
        .order('full_name');

      if (error) throw error;
      setPatients(data?.map(p => ({ id: p.id, fullName: p.full_name, phone: p.phone || '' })) || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const generatePatientCode = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('patient_code')
        .eq('clinic_id', currentClinic?.id)
        .like('patient_code', `${config.patientCodePrefix}%`)
        .order('patient_code', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastCode = data[0].patient_code;
        const lastNumber = parseInt(lastCode.replace(config.patientCodePrefix, ''));
        nextNumber = lastNumber + 1;
      }
      
      return `${config.patientCodePrefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating patient code:', error);
      return `${config.patientCodePrefix}0001`;
    }
  };

  const handleCreateQuickPatient = async () => {
    try {
      setLoading(true);
      const patientCode = await generatePatientCode();
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          full_name: quickPatient.fullName,
          phone: quickPatient.phone,
          email: quickPatient.email || null,
          age: quickPatient.age || null,
          gender: quickPatient.gender || null,
          patient_code: patientCode,
          clinic_id: currentClinic?.id
        })
        .select('id, full_name, phone')
        .single();

      if (error) throw error;

      const newPatient = { id: data.id, fullName: data.full_name, phone: data.phone || '' };
      setPatients([...patients, newPatient]);
      setSelectedPatient(newPatient);
      setSelectedPatientId(newPatient.id);
      setSearchTerm(`${newPatient.fullName} - ${newPatient.phone}`);
      setShowQuickPatientForm(false);
      setQuickPatient({ fullName: '', phone: '', email: '', age: undefined, gender: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedPatientId(patient.id);
    setSearchTerm(`${patient.fullName} - ${patient.phone}`);
    setShowPatientDropdown(false);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (filteredPatients.length > 0) {
        handlePatientSelect(filteredPatients[0]);
      }
    }
  };

  const addMedication = () => {
    setMedications([...medications, {
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      mealInstruction: ''
    }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure we have a valid patient ID
      const finalPatientId = selectedPatientId || patientId || editingGroup?.patientId;
      if (!finalPatientId) {
        throw new Error('Patient ID is required');
      }
      
      const combinedNotes = [observations, investigations, diagnosis].filter(Boolean).join('\n\n');
      
      if (editingGroup) {
        // Delete all existing prescriptions for this group first
        const existingIds = editingGroup.medications.map((med: any) => med.id);
        const { error: deleteError } = await supabase
          .from('prescriptions')
          .delete()
          .in('id', existingIds);
        
        if (deleteError) throw deleteError;
        
        // Insert all medications as new records
        const prescriptionData = medications.map(med => ({
          patient_id: finalPatientId,
          clinic_id: currentClinic?.id,
          medication_name: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          meal_instruction: med.mealInstruction,
          notes: combinedNotes || null,
          prescribed_by: prescribedBy || null,
          prescribed_date: date
        }));

        const { error } = await supabase
          .from('prescriptions')
          .insert(prescriptionData);
        
        if (error) throw error;
      } else {
        // Create new prescriptions
        const prescriptionData = medications.map(med => ({
          patient_id: finalPatientId,
          clinic_id: currentClinic?.id,
          medication_name: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          meal_instruction: med.mealInstruction,
          notes: combinedNotes || null,
          prescribed_by: prescribedBy || null,
          prescribed_date: date
        }));

        const { error } = await supabase
          .from('prescriptions')
          .insert(prescriptionData);
        
        if (error) throw error;
      }

      // Create follow-up appointment if requested (only for new prescriptions)
      if (!editingGroup && createAppointment && followUpDate) {
        const { error: appointmentError } = await supabase
          .from('appointments')
          .insert({
            patient_id: finalPatientId,
            clinic_id: currentClinic?.id,
            service: 'Follow-up Consultation',
            appointment_date: followUpDate,
            appointment_time: '10:00',
            status: 'scheduled',
            notes: 'Follow-up appointment created from prescription'
          });
        
        if (appointmentError) {
          console.error('Error creating appointment:', appointmentError);
        }
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Pill className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">
                {editingGroup ? 'Edit Multi-Medication Prescription' : 'Add Multi-Medication Prescription'}
              </h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">Patient & Prescription Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {!patientId && !editingGroup && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      required
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowPatientDropdown(true);
                        if (!e.target.value) {
                          setSelectedPatient(null);
                          setSelectedPatientId('');
                        }
                      }}
                      onKeyPress={handleSearchKeyPress}
                      onFocus={() => setShowPatientDropdown(true)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Search by name or phone..."
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    
                    {showPatientDropdown && filteredPatients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredPatients.map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <div className="font-medium">{patient.fullName}</div>
                            <div className="text-sm text-gray-600">{patient.phone}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickPatient({ ...quickPatient, fullName: searchTerm });
                      setShowQuickPatientForm(true);
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    title="Add New Patient"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
              <input
                type="text"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Doctor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-800">Medications</h3>
              </div>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((medication, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                    </div>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medication *</label>
                      <input
                        type="text"
                        required
                        list={`medications-${index}`}
                        value={medication.medicationName}
                        onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Medication name"
                      />
                      <datalist id={`medications-${index}`}>
                        {medicationOptions.map((med) => (
                          <option key={med} value={med} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                      <input
                        type="text"
                        required
                        list={`dosages-${index}`}
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 100mg"
                      />
                      <datalist id={`dosages-${index}`}>
                        {dosages.map((dosage) => (
                          <option key={dosage} value={dosage} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                      <input
                        type="text"
                        required
                        list={`frequencies-${index}`}
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 1-1-1"
                      />
                      <datalist id={`frequencies-${index}`}>
                        {frequencies.map((freq) => (
                          <option key={freq} value={freq} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        required
                        list={`durations-${index}`}
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 5 days"
                      />
                      <datalist id={`durations-${index}`}>
                        {durations.map((duration) => (
                          <option key={duration} value={duration} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meal *</label>
                      <select
                        required
                        value={medication.mealInstruction}
                        onChange={(e) => updateMedication(index, 'mealInstruction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select</option>
                        {mealInstructions.map((instruction) => (
                          <option key={instruction} value={instruction}>
                            {instruction}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">Clinical Notes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Clinical observations..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investigations</label>
                <textarea
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Tests, X-rays..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Medical diagnosis..."
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">Follow-up</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="createAppointment"
                  checked={createAppointment}
                  onChange={(e) => setCreateAppointment(e.target.checked)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="createAppointment" className="text-sm font-medium text-gray-700">
                  Create appointment for follow-up
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : editingGroup ? 'Update Prescription' : 'Save Prescription'}</span>
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Quick Patient Form Modal */}
      {showQuickPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Add New Patient</h3>
              <button 
                onClick={() => setShowQuickPatientForm(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={quickPatient.fullName}
                  onChange={(e) => setQuickPatient({ ...quickPatient, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={quickPatient.phone}
                  onChange={(e) => setQuickPatient({ ...quickPatient, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={quickPatient.email}
                  onChange={(e) => setQuickPatient({ ...quickPatient, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={quickPatient.age || ''}
                    onChange={(e) => setQuickPatient({ ...quickPatient, age: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={quickPatient.gender}
                    onChange={(e) => setQuickPatient({ ...quickPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                type="button"
                onClick={() => setShowQuickPatientForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateQuickPatient}
                disabled={!quickPatient.fullName || !quickPatient.phone || loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MultiPrescriptionForm;