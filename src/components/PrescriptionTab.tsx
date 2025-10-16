import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Printer, Pill, User, Calendar, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/clinic';
import MultiPrescriptionForm from './MultiPrescriptionForm';
import { X } from 'lucide-react';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
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

const PrescriptionTab: React.FC = () => {
  const { currentClinic } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingGroup, setViewingGroup] = useState<any>(null);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    if (!currentClinic?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patients!inner(full_name)
        `)
        .eq('clinic_id', currentClinic.id)
        .order('prescribed_date', { ascending: false });

      if (error) throw error;

      const transformedPrescriptions: Prescription[] = data?.map(p => ({
        id: p.id,
        patientId: p.patient_id,
        patientName: p.patients.full_name,
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

      setPrescriptions(transformedPrescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.prescribedBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group prescriptions by patient and date
  const groupedPrescriptions = filteredPrescriptions.reduce((groups, prescription) => {
    const key = `${prescription.patientId}-${prescription.prescribedDate}`;
    if (!groups[key]) {
      groups[key] = {
        patientId: prescription.patientId,
        patientName: prescription.patientName,
        prescribedDate: prescription.prescribedDate,
        prescribedBy: prescription.prescribedBy,
        medications: []
      };
    }
    groups[key].medications.push(prescription);
    return groups;
  }, {} as Record<string, {
    patientId: string;
    patientName: string;
    prescribedDate: string;
    prescribedBy?: string;
    medications: Prescription[];
  }>);

  const prescriptionGroups = Object.values(groupedPrescriptions);

  const handleViewPrescription = (group: any) => {
    setViewingGroup(group);
    setShowViewModal(true);
  };

  const handleEditPrescription = (group: any) => {
    setEditingGroup(group);
    setShowEditForm(true);
  };

  const handleDelete = async (prescriptionId: string) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', prescriptionId);

      if (error) throw error;
      fetchPrescriptions();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Failed to delete prescription. Please try again.');
    }
  };

  const handlePrintGroup = (group: {
    patientId: string;
    patientName: string;
    prescribedDate: string;
    prescribedBy?: string;
    medications: Prescription[];
  }) => {
    const printContent = `
      <html>
        <head>
          <title>Prescription - ${group.patientName}</title>
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
            <div><strong>Name:</strong> ${group.patientName}</div>
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

  const handlePrint = (prescription: Prescription) => {
    const printContent = `
      <html>
        <head>
          <title>Prescription - ${prescription.patientName}</title>
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
            <div><strong>Name:</strong> ${prescription.patientName}</div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-200 p-4 rounded-xl shadow-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-200 p-2 rounded-lg">
              <Pill className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Prescription Management</h3>
              <p className="text-gray-600 text-sm">Manage patient prescriptions and medications</p>
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search prescriptions by patient name, medication, or doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : prescriptionGroups.length === 0 ? (
        <div className="text-center py-12">
          <Pill className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No prescriptions match your search criteria.' : 'Get started by creating a new prescription.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptionGroups.map((group) => (
            <motion.div
              key={`${group.patientId}-${group.prescribedDate}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-blue-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Prescription Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-3 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-200 p-2 rounded-lg">
                      <Pill className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{group.patientName}</h4>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(group.prescribedDate).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
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
                      onClick={() => handlePrintGroup(group)}
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
                            onClick={() => handleDelete(prescription.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete Medication"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex space-x-2">
                          <div className="bg-blue-50 p-1 rounded border border-blue-200 flex-1">
                            <p className="text-xs text-blue-600 font-medium">Dosage</p>
                            <p className="text-sm font-bold text-blue-800">{prescription.dosage}</p>
                          </div>
                          <div className="bg-purple-50 p-1 rounded border border-purple-200 flex-1">
                            <p className="text-xs text-purple-600 font-medium">Frequency</p>
                            <p className="text-sm font-bold text-purple-800">{prescription.frequency}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="bg-emerald-50 p-1 rounded border border-emerald-200 flex-1">
                            <p className="text-xs text-emerald-600 font-medium">Duration</p>
                            <p className="text-sm font-bold text-emerald-800">{prescription.duration}</p>
                          </div>
                          <div className="bg-amber-50 p-1 rounded border border-amber-200 flex-1">
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
          ))}
        </div>
      )}

      {/* Prescription Form Modal */}
      <MultiPrescriptionForm
        isOpen={showPrescriptionForm}
        onClose={() => setShowPrescriptionForm(false)}
        onSave={() => {
          setShowPrescriptionForm(false);
          fetchPrescriptions();
        }}
      />

      {/* Edit Prescription Form Modal */}
      <MultiPrescriptionForm
        isOpen={showEditForm}
        editingGroup={editingGroup}
        onClose={() => {
          setShowEditForm(false);
          setEditingGroup(null);
        }}
        onSave={() => {
          setShowEditForm(false);
          setEditingGroup(null);
          fetchPrescriptions();
        }}
      />

      {/* View Prescription Modal */}
      {showViewModal && viewingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">
                    Prescription Details - {viewingGroup.patientName}
                  </h2>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Prescription Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border">
                    <span className="font-medium text-gray-600">Date:</span>
                    <p className="font-bold text-blue-700">{new Date(viewingGroup.prescribedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <span className="font-medium text-gray-600">Prescribed By:</span>
                    <p className="font-bold text-green-700">Dr. {viewingGroup.prescribedBy || 'N/A'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <span className="font-medium text-gray-600">Patient:</span>
                    <p className="font-bold text-purple-700">{viewingGroup.patientName}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <span className="font-medium text-gray-600">Medications:</span>
                    <p className="font-bold text-amber-700">{viewingGroup.medications.length}</p>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">Medications</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {viewingGroup.medications.map((med: any, index: number) => (
                    <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900">{med.medicationName}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 p-2 rounded border">
                          <p className="text-xs text-gray-600 font-medium">Dosage</p>
                          <p className="font-semibold text-blue-700">{med.dosage}</p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded border">
                          <p className="text-xs text-gray-600 font-medium">Frequency</p>
                          <p className="font-semibold text-purple-700">{med.frequency}</p>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded border">
                          <p className="text-xs text-gray-600 font-medium">Duration</p>
                          <p className="font-semibold text-emerald-700">{med.duration}</p>
                        </div>
                        <div className="bg-amber-50 p-2 rounded border">
                          <p className="text-xs text-gray-600 font-medium">Meal Instructions</p>
                          <p className="font-semibold text-amber-700">{med.mealInstruction}</p>
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
            
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => handlePrintGroup(viewingGroup)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTab;